const express = require("express");
const { createAt } = require("./utils/format-time");
const fillter = require("bad-words");
const { getUserList, addUser, removeUser, findUser } = require("./utils/list-users");
const app = express();
const path = require("path");
const publicPath = path.join(__dirname, "../public");
const http = require("http");
app.use(express.static(publicPath));
const server = http.createServer(app);
const socketio = require("socket.io");
const { create } = require("domain");
const io = socketio(server);
// lắng nghe sự kiên kết nối của 1 client 
io.on("connection", (socket) => {
    console.log("new client connect");
    // socket.emit("responsive", "Welcome");
    socket.on("Join room from client to server", (params) => {
        const { room, username } = params;
        socket.join(room);
        addUser(user = {
            id: socket.id,
            username,
            room
        });
        socket.emit("responsive", createAt(`Wellcome to room ${room}`, 'Admin'))
        // gui cac client con lai : co 1 user tham gia vao chat
        socket.broadcast.to(room).emit("responsive", createAt(`new client join chat join room ${room}`, 'Admin'));
        // get userlist
        io.to(room).emit("send list user", getUserList(room));
        //chat
        socket.on("Send mess-client", (mess, cb) => {
            fill = new fillter();
            if (fill.isProfane(mess)) {
                return cb("bad-word");
            };
            const user = findUser(socket.id);
            const messText = createAt(mess, user.username);
            io.to(room).emit("responsive", messText);
            cb();
        });
        //gui vi tri
        socket.on("send location", (ojectLocation) => {
            const user = findUser(socket.id);
            const { latitude, longitude } = ojectLocation;
            io.emit("send link location for client", createAt(`http://www.google.com/maps?q=${latitude},${longitude}`, user.username));
        });
        //ngat ket noi
        socket.on("disconnect", () => {
            removeUser(socket.id);
            io.to(room).emit("send list user", getUserList(room));
            console.log("Disconnect : client left server");
        });

    });
});
const port = 6789;
server.listen(port, () => {
    console.log(`App run on http://localhost:${port}`);
})