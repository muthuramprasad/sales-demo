const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  firstName: { type: String, required: true ,index: true,},
  lastName: { type: String, required: true },
  email: { type: String, required: true,index: true, },
  phone: { type: String, required: true,index: true, },
  company: { type: String ,required: true},
  address: { type: String ,required: true},
  landmark: { type: String ,required: true},
  pincode: { type: String ,required: true},
businessName:{ type: String,required: true },
  source: { 
    type: String, 
  
    required: true 
  },
  leadStatus: { 
    type: String, 
  
    required: true
  },
  assignedTo: { type: String, required: true },
  notes: [{ 
    noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note' }, // Store note ID
    text: { type: String } 
   
  }],
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isConvertIntoCustomers:{
    type: Boolean,
    default: false,
  }


}, { timestamps: true });




leadSchema.index({ firstName: 1, email: 1, phone: 1 });

module.exports = mongoose.model('Lead',leadSchema);
