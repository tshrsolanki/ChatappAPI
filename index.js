const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const app = express();
const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: "*",
  },
});
const { router } = require("./router.js");
const cors = require("cors");
const PORT = process.env.PORT || 5000;

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  users,
  findAdmin,
} = require("./users");
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(router);
app.get("/abc", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  socket.on("request", ({ name, room }) => {
    const adminId = findAdmin(room);
    socket.to(adminId).emit("request", { name, id: socket.id });
  });
  socket.on("reply", ({ status, id }) => {
    socket.to(id).emit("reply", status);
  });
  socket.on("join", ({ name, room, create }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room, create });
    if (error) {
      callback(error);
    }

    socket.emit("message", {
      user: "system",
      text: `${user.name},welcome to the room ${user.room}`,
    });
    socket.join(user.room);
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "system", text: `${user.name} has joined` });

    io.to(user.room).emit("roomData", {
      room: room,
      users: getUsersInRoom(room),
    });
  });
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    // console.log(user);

    io.to(user.room).emit("message", { user: user.name, text: message });
    // io.to(user.room).emit("roomdata", {
    //   room: user.room,
    //   users: getUserinroom(user.room),
    // });
    callback();
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
    const index = users.findIndex((user) => {
      return user.id === socket.id;
    });
    if (index == -1) {
      return;
    }

    const user = removeUser({
      id: socket.id,
      room: io.sockets.adapter.rooms.get(users[index].room),
    });

    if (user) {
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
      io.to(user.room).emit("message", {
        user: "system",
        text: `${user.name} has left`,
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`%c ${PORT}`, "font-weight:bold", "||", "index.js", "line-", 103);
});
