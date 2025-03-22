const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
    notes: {
        type: String,

        index: true
    },
   
    leadId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Lead', 
        required: true,
        index: true
    }
},
{ timestamps: true }
);

// Creating an index on 'notes' and 'content'
notesSchema.index({ notes: 1,  leadId: 1 });

module.exports = mongoose.model('Note', notesSchema);
