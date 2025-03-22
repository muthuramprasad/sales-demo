const { Server } = require("socket.io");

let io; // Declaring io globally

function initializeSocket(server) {
    io = new Server(server, {
        cors: { origin: "*" },
        pingTimeout: 60000, // Prevents frequent disconnections
    });

    io.on("connection", (socket) => {
        console.log(" New WebSocket Connected:", socket.id);
        socket.on("disconnect", () => console.log("❌ WebSocket Disconnected:", socket.id));
    });

    return io; //  Returns io instance
}

function getIo() {
    if (!io) {
        throw new Error("❌ Socket.io is not initialized! Call `initializeSocket(server)` first.");
    }
    return io;
}

module.exports = { initializeSocket, getIo };
