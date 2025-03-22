const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const winston = require("winston");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { createServer } = require("http");
const { initializeSocket } = require("./app/Config/socket.js");

dotenv.config();

const port = process.env.PORT || 6000;
const app = express();
const server = createServer(app);

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "logs/app.log" })
    ],
});

//  Fix: Use correct connection pooling option
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI, {
    maxPoolSize: 10, //  Use maxPoolSize instead of poolSize
    serverSelectionTimeoutMS: 5000,
  
})
.then(() => logger.info(" Connected to MongoDB"))
.catch((err) => {
    logger.error(" Database connection failed:", err);
    process.exit(1);
});

//  Fix: Initialize Socket.IO and store the instance
const io = initializeSocket(server);

//  Load Routes AFTER initializing the server
require("./app/Router/CreateUser")(app);
require("./app/Router/Lead.js")(app);
require("./app/Router/notes.js")(app);

//  Fix: Ensure Server Starts Last
server.listen(port, () => {
    logger.info(` Server running on port ${port}`);
});
