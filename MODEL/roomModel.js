const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
  roomName: {
    type: String,
    required: true,
  },
  roomAdmin: {
    type: String,
    required: true,
  },
  roomMembers: {
    type: [],
    required: true,
  },
  adminSocketId: {
    type: String,
  },
});
const Room = mongoose.model("room", roomSchema);
module.exports = Room;
