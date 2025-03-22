const db = require("../Model");
const LeadModel = db.Leads;
const { getIo } = require("../Config/socket"); //  Use getIo to get Socket.IO instance

exports.createLead = async (req, res) => {
    console.log('Creating Lead:', req.body);

    let { firstName, lastName, email, phone, company,address,  
        landmark, 
        pincode, businessName, source, leadStatus, assignedTo } = req.body;

    try {
        // Check if the lead already exists
        const existingLead = await LeadModel.findOne({ $or: [{ email }, { phone }] });

        if (existingLead) {
            return res.status(400).json({ message: "Lead already exists" });
        }

        // Create a new lead
        // Create a new lead
        const newLead = new LeadModel({
            firstName,
            lastName,
            email,
            phone,
            company,
            address,  
            landmark, 
            pincode, 
            businessName,
            source,
            leadStatus,
            assignedTo
        });

        const savedLead = await newLead.save();

        // Emit a real-time event to all clients
        const io = getIo();
        io.emit("newLead", savedLead);  

        return res.status(201).json({
            message: "Lead created successfully",
            lead: savedLead
        });

    } catch (err) {
        console.error("Error creating lead:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

 
exports.toggleConvertIntoCustomer = async (req, res) => {
    const { leadId } = req.params;
  
    try {
        const lead = await LeadModel.findById(leadId);

  
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }
  
      lead.isConvertIntoCustomers = !lead.isConvertIntoCustomers;
      await lead.save();
  
      res.status(200).json({ message: "Lead conversion status updated", lead });
    } catch (error) {
      res.status(500).json({ message: "Error updating lead status", error });
    }
  };
  

exports.getLeads = async (req, res) => {
    try {
        console.log("Fetching Leads...");

        const { page = 1, itemPerPage = 10, search, startDate, endDate, isDeleted,isConvertIntoCustomers } = req.query;

        const pageNumber = parseInt(page, 10);
        const limit = parseInt(itemPerPage, 10);
        const skip = (pageNumber - 1) * limit;

        //  Get current month start & end dates
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        lastDayOfMonth.setHours(23, 59, 59, 999);

        //  Default: Fetch current month's data unless overridden by query params
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

        let searchFilter = {};
        if (search) {
            searchFilter.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { businessName: { $regex: search, $options: "i" } },
            ];
        }

        const isDeletedFilter = isDeleted !== undefined ? { isDeleted: isDeleted === "true" } : { isDeleted: false };

        const query = { ...dateFilter, ...searchFilter, ...isDeletedFilter, isConvertIntoCustomers: false };


        //  Optimized Query Execution
        const leads = await LeadModel.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("firstName lastName email phone company landmark pincode address businessName source leadStatus assignedTo isDeleted createdAt")
            .lean();

        //  Count total leads for pagination
        const totalLeads = await LeadModel.countDocuments(query);
        const totalPages = Math.ceil(totalLeads / limit);

        //  Get current month name & year
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const currentMonth = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

        //  Emit event to notify all clients about updated lead list
        const io = getIo();
        io.emit("updateLeads", leads);

        res.status(200).json({
            success: true,
            month: currentMonth,  //  Include current month in response
            leads,
            pagination: {
                totalLeads,
                totalPages,
                currentPage: pageNumber,
                pageNumbers: Array.from({ length: totalPages }, (_, i) => i + 1),
            },
        });

    } catch (err) {
        console.error("Error fetching leads:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateLead=async(req,res)=>{
    const {id}=req.params;
    const update=req.body;

    try{
        console.log('Updated Lead',id,'update',update);

        const lead=await LeadModel.findOne({_id:id,isDeleted:false});
        if (!lead) {
            return res.status(404).json({ message: "Lead not found or already deleted" });
          }

          const updateLead=await LeadModel.findByIdAndUpdate(id,update,{new:true,  runValidators: true,});

             //  Emit event to notify all clients about updated lead list
        const io = getIo();
        io.emit("EditedLeads", updateLead);
          res.status(200).json({ message: "Lead updated successfully", updateLead });
          
    }
    catch (err) {
        console.error("Error updating lead:", err);
        res.status(500).json({ message: "Internal server error" });
      }
}



exports.SoftDeleteLead = async (req, res) => {
    const { id } = req.params;

    try {
        console.log('Soft Deleting Lead:', id);

        // Find the lead before updating
        const lead = await LeadModel.findOne({ _id: id, isDeleted: false });

        if (!lead) {
            return res.status(404).json({ message: "Lead not found or already deleted" });
        }

        //  Soft delete: Set isDeleted = true
        lead.isDeleted = true;
        await lead.save();

        //  Emit event to notify clients about Soft Delete
        const io = getIo();
        io.emit("deletedLead", { id, isDeleted: true });

        res.status(200).json({ message: "Lead soft deleted successfully", lead });

    } catch (err) {
        console.error("Error soft deleting lead:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
