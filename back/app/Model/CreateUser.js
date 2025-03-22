const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true, // Indexing for faster searches
  },
  role: {
    type: String,
    required: true,
    enum: ["superadmin", "user"],
    index: true, // Indexing role for frequent filters
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true, // Unique index for quick lookups
  },
  password: { type: String, required: true },
  phone: { type: String, required: true, index: true }, // Index phone for searches
  status: { type: String, required: true, enum: ["active", "inactive"], index: true }, // Index status for filtering
}, { timestamps: true });

// Create a compound index for faster searching
userSchema.index({ name: 1, email: 1, phone: 1 });

module.exports = mongoose.model("User", userSchema);
