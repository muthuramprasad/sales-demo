const db= require("../Model");
const UserModal = db.users;
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const winston = require("winston");
const  {LRUCache}  = require('lru-cache')
const { io } = require("../../index"); //  Import from the main index.js





const secret_key = process.env.JWT_SECRET || "43bJqrllut4pWPIT1EtDFvdgH"; // Store secret key in env



// Winston Logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: "logs/user.log" })],
});

// Joi Schema for User Validation
const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  role: Joi.string().valid("superadmin", "user").required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().min(10).max(15).required(),
  status: Joi.string().valid("active", "inactive").required(),
});

// Create User API
// LRU Cache for user lookups
const userCache = new LRUCache({
  max: 500, // Store more items
  ttl: 1000 * 60 * 10, // Cache for 10 minutes
});

// User Signup API
exports.user = async (req, res) => {
  console.log(req.body);
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { name, role, email, password, phone, status } = req.body;
  const lowerCaseEmail = email.toLowerCase(); //  Define lowerCaseEmail properly

  try {
    //  1. Check MongoDB before checking cache
    const existUser = await UserModal.findOne({ email: lowerCaseEmail }).select("_id").lean();
    
    if (existUser) {
      userCache.set(lowerCaseEmail, true); //  Store user existence in cache
      return res.status(409).json({ message: "User already exists in database" });
    }

    //  2. If user exists in cache but not in DB, clear the cache
    if (userCache.has(lowerCaseEmail)) {
      console.log("Cache issue detected! Clearing stale cache.");
      userCache.delete(lowerCaseEmail);
    }

    //  3. Hash password & create user
    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = new UserModal({ name, role, email: lowerCaseEmail, phone, status, password: hashedPassword });

    const insertedUser = await UserModal.create(newUser);

    //  4. Generate JWT
    const token = JWT.sign({ id: insertedUser._id, email: lowerCaseEmail, role }, secret_key, { expiresIn: "24h" });

    logger.info(`User created: ${lowerCaseEmail}`);

    res.status(201).json({ result: { id: insertedUser._id, name, role, email: lowerCaseEmail, phone, status }, token });
  } catch (err) {
    logger.error("Error creating user", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// User Login API
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login",req.body);

  try {
    const existingUser = await UserModal.findOne({ email });
    if (!existingUser) return res.status(404).json({ message: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid credentials" });

    const token = JWT.sign({ id: existingUser._id, email, role: existingUser.role }, secret_key, { expiresIn: "24h" });

    logger.info(`User logged in: ${email}`);
    res.status(200).json({
      message: "Login Successful",
      user: { id: existingUser._id, name: existingUser.name, email, role: existingUser.role, phone: existingUser.phone, status: existingUser.status },
      token,
    });
  } catch (err) {
    logger.error("Error during login", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};





const cache = new LRUCache({
  max: 100, // Store up to 100 items
  ttl: 1000 * 60 * 5, // Cache expires in 5 minutes
});

// Get Users API (Paginated)
exports.getUsers = async (req, res) => {
  const cacheKey = `users_${req.query.page}_${req.query.itemsPerPage}_${req.query.search}`;

  // Check if data is cached
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log(" Returning Cached Data:", cachedData);
    return res.status(200).json({ fromCache: true, ...cachedData });
  }

  try {
    const { page = 1, itemsPerPage = 10, search } = req.query;
    const pageNumber = parseInt(page, 10);
    const limit = parseInt(itemsPerPage, 10);
    const skip = (pageNumber - 1) * limit;

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch users
    const users = await UserModal.find(query)
      .select("name email role phone status") // Only fetch required fields
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Count total users
    const totalUsers = await UserModal.countDocuments(query);

    const totalPages = Math.ceil(totalUsers / limit);
    const response = {
      success: true,
      users,
      pagination: { totalUsers, totalPages, currentPage: pageNumber },
    };

    // Store response in cache
    // cache.set(cacheKey, response);

    
    console.log(" Cached New Data:", response);

    res.status(200).json(response);
  } catch (error) {
    console.error(" Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};





exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user before deleting (Optional: Check if exists)
    const user = await UserModal.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user from the database
    await UserModal.findByIdAndDelete(id);

    // Ensure io is available before emitting event
    if (typeof io !== "undefined") {
      io.emit("userDeleted", { userId: id });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};




exports.updateUser = async (req, res) => {
  const { id } = req.params;
  let { password, role, ...updateFields } = req.body;

  try {
    // Find existing user
    const existingUser = await UserModal.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // If a new password is provided, compare with the existing hashed password
    if (password) {
      const isSamePassword = await bcrypt.compare(password, existingUser.password);

      if (!isSamePassword) {
        // If password is different, hash the new password
        updateFields.password = await bcrypt.hash(password, 10);
      } else {
        // If it's the same password, do not update it
        console.log("Password is the same, no need to update.");
      }
    }

    // Allow role update only if it's valid
    if (role && ["superadmin", "user", "editor"].includes(role)) {
      updateFields.role = role;
    }

    // Update user with new fields
    const updatedUser = await UserModal.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedUser) {
      return res.status(400).json({ message: "User update failed" });
    }

    // Emit socket event if needed
    if (typeof io !== "undefined") {
      io.emit("userUpdated", { userId: id, update: updatedUser });
    }

    return res.status(200).json({
      message: "User Updated Successfully",
      updatedUser,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
