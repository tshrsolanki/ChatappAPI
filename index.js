const socketio = require("socket.io");
const app = require("./app.js");
const http = require("http");
const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 5000;

const connectDB = require("./connectDB.js");
const Room = require("./MODEL/roomModel.js");
const { redisStart } = require("./session.js");
const Authentication = require("./MODEL/authenticationModel.js");
const startServer = async () => {
  await connectDB();
  await redisStart();
  server.listen(PORT, () => {
    console.log(PORT);
  });
};
startServer();
io.on("connection", (socket) => {
  socket.on("join", async ({ roomName, username }) => {
    socket.join(roomName);
    let roomData;
    try {
      roomData = await Room.findOne({ roomName }, { _id: 0, __v: 0 });
      roomData = roomData.toJSON();
      socket.broadcast.emit("update", roomData.roomMembers);
      socket.emit("message", {
        userData: "system",
        text: `${username},welcome to the room ${roomName}`,
      });
      socket.broadcast.to(roomName).emit("message", {
        userData: "system",
        text: `${username} has joined`,
      });
    } catch (error) {
      console.log(error, "||", "index.js", "line-", 33);
      return;
    }
  });

  socket.on("sendMessage", ({ message, username, roomName }, callback) => {
    io.to(roomName).emit("message", { userData: username, text: message });
    callback();
  });
  socket.on("closechat", async (user, callback) => {
    await Authentication.updateOne({ email: user.email }, { roomName: "" });
    const temp = await Room.findOne({ roomName: user.roomName });
    const roomData = temp.toJSON();
    if (roomData.roomMembers.length === 1) {
      await Room.deleteOne({ roomName: user.roomName });
    } else {
      const newRoomMembers = roomData.roomMembers.filter((roomuser) => {
        return roomuser !== user.username;
      });
      await Room.updateOne(
        { roomName: user.roomName },
        { roomMembers: newRoomMembers }
      );
      socket.broadcast.to(user.roomName).emit("message", {
        userData: "system",
        text: `${user.username} has left the chat`,
      });
      socket.broadcast.emit("update", newRoomMembers);
    }
    callback();
  });
  socket.on("disconnect", () => {
    console.log("disconnect");
  });
});
