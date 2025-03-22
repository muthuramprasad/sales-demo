
const db = require("../Model");

const NoteModel = db.Notes;
const LeadModel = db.Leads; 
const { getIo } = require("../Config/socket"); //  Use getIo to get Socket.IO instance



exports.createNotes = async (req, res) => {
    try {
        console.log('Creating Notes:', req.body);

        let { notes } = req.body;
        let { id: leadId } = req.params;  

        if (!leadId) {
            return res.status(400).json({ message: "Lead ID is required." });
        }

        // **Create a new Note**
        const newNote = new NoteModel({
            notes,
            leadId
        });

        const savedNote = await newNote.save();

        // **Update the Lead document with the new note**
        await LeadModel.findByIdAndUpdate(
            leadId,
            { $push: { notes: { noteId: savedNote._id, text: notes } } }, // Push note details
            { new: true }
        );

        // **Fetch lead details and populate the response**
        const leadDetails = await LeadModel.findById(leadId)
            .select("firstName lastName email phone company address landmark pincode businessName source leadStatus assignedTo")
            .lean();

        if (!leadDetails) {
            return res.status(404).json({ message: "Lead not found" });
        }

        // **Emit real-time event to notify all clients**
        const io = getIo();
        io.emit("newNote", { note: savedNote, lead: leadDetails });

        // **Send response with both note and lead details**
        return res.status(201).json({
            message: "Notes created successfully",
            Note: savedNote,
            Lead: leadDetails
        });

    } catch (err) {
        console.error("Error creating Notes:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};



 




exports.getNotes = async (req, res) => {
    try {
        const { page = 1, itemPerPage = 5, search, startDate, endDate, isDeleted } = req.query;

        const pageNumber = parseInt(page, 10) || 1;
        const limit = parseInt(itemPerPage, 10) || 5;
        const skip = (pageNumber - 1) * limit;

        // Check if MongoDB is connected before querying
        if (!NoteModel.db.readyState) {
            return res.status(500).json({ message: "Database not connected" });
        }

        // 🔹 Default: Fetch current month's data unless overridden by query params
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        lastDayOfMonth.setHours(23, 59, 59, 999);

        let dateFilter = {};
        if (startDate && endDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            dateFilter.createdAt = { $gte: start, $lte: end };
        } else {
            dateFilter.createdAt = { $gte: firstDayOfMonth, $lte: lastDayOfMonth };
        }

        // 🔹 Search Filter (Search across multiple fields)
        let searchFilter = {};
        if (search) {
            searchFilter.$or = [
                { "leadId.firstName": { $regex: search, $options: "i" } },
                { "leadId.lastName": { $regex: search, $options: "i" } },
                { "leadId.email": { $regex: search, $options: "i" } },
                { "leadId.phone": { $regex: search, $options: "i" } },
                { "leadId.businessName": { $regex: search, $options: "i" } },
            ];
        }

        // 🔹 Fetch Notes with Filters
        const notes = await NoteModel.find({
            ...searchFilter,
            ...dateFilter,
            ...(isDeleted !== undefined && { isDeleted: isDeleted === "true" }),
        })
        .sort({ createdAt: -1 }) // Sort by latest first
        .skip(skip)
        .limit(limit)
        .populate({
            path: "leadId", // Populate lead details
            select: "firstName lastName email phone company address landmark pincode businessName source leadStatus assignedTo"
        })
        .lean();

        // 🔹 Count total notes for pagination
        const totalNotes = await NoteModel.countDocuments({
            ...searchFilter,
            ...dateFilter,
            ...(isDeleted !== undefined && { isDeleted: isDeleted === "true" }),
        });

        const totalPages = Math.ceil(totalNotes / limit);

        // 🔹 Emit real-time update event to all clients
        try {
            const io = getIo();
            io.emit("updateNotes", { notes });
        } catch (error) {
            console.error("Socket.IO error:", error);
        }

        // 🔹 Send Response
        res.status(200).json({
            notes,
            pagination: {
                totalNotes,
                totalPages,
                currentPage: pageNumber,
                itemPerPage: limit,
            },
        });
    } catch (err) {
        console.error("Error fetching notes:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};




exports.getNotesByLead = async (req, res) => {
    try {
        const { id: leadId } = req.params;

        if (!leadId) {
            return res.status(400).json({ message: "Lead ID is required." });
        }

        const notes = await NoteModel.find({ leadId })  // Fetch notes for the specific lead
            .sort({ createdAt: -1 }) // Order by latest
            .lean();

        // Ensure an empty array instead of an error if no notes exist
        const responseNotes = notes.length ? notes : [];

        // Emit event to notify other clients that notes are being viewed
        const io = getIo();
        io.emit("viewingNotes", { leadId, notes: responseNotes });

        res.status(200).json({ notes: responseNotes });
    } catch (err) {
        console.error("Error fetching notes for lead:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};





exports.updateNote=async(req,res)=>{
    const {id}=req.params;
    const update=req.body;

    try{
        console.log('Updated Note',id,'update',update);

        const Note=await NoteModel.findOne({_id:id,isDeleted:false});
        if (!Note) {
            return res.status(404).json({ message: "Notesnot found or already deleted" });
          }

          const updateNote=await NoteModel.findByIdAndUpdate(id,update,{new:true,  runValidators: true,});

             //  Emit event to notify all clients about updated Noteslist
        const io = getIo();
        io.emit("EditedNotes", updateNote);
          res.status(200).json({ message: "Notesupdated successfully", updateNotes});
          
    }
    catch (err) {
        console.error("Error updating Note:", err);
        res.status(500).json({ message: "Internal server error" });
      }
}



exports.SoftDeleteNotes= async (req, res) => {
    const { id } = req.params;

    try {
        console.log('Soft Deleting Note:', id);

        // Find the Notesbefore updating
        const Notes= await NoteModel.findOne({ _id: id, isDeleted: false });

        if (!Notes) {
            return res.status(404).json({ message: "Notesnot found or already deleted" });
        }

        //  Soft delete: Set isDeleted = true
        Notes.isDeleted = true;
        await Notes.save();

        //  Emit event to notify clients about Soft Delete
        const io = getIo();
        io.emit("deletedNote", { id, isDeleted: true });

        res.status(200).json({ message: "Notessoft deleted successfully", Notes});

    } catch (err) {
        console.error("Error soft deleting Note:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
