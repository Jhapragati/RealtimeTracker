const express = require('express');
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");  // View engine setup

// Use express.static to serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function(socket) {
    console.log("connected");

    socket.on("send-location", function(data) {
        io.emit("receive-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", function() {  // Moved inside connection block
        io.emit("user-disconnected", socket.id);  // Use socket.id instead of socket.io
    });
});

app.get("/", function(req, res) {
    console.log("Rendering index.ejs");  // Debugging Step: Logs when the route is hit
    res.render("index");  // Render index.ejs
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
