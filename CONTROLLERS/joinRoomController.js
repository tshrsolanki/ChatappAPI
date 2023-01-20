const Authentication = require("../MODEL/authenticationModel");
const Room = require("../MODEL/roomModel");

const joinRoomController = async (req, res) => {
  const { roomName, user } = req.body;
  const room = await Room.findOne({
    roomName,
  });
  if (!room) {
    return res.json({ message: "Invalid room name, no such room exists" });
  } else {
    const roomData = room.toJSON();
    const { roomMembers } = roomData;

    const newRoomMembers = [...roomMembers, user.username];
    const finalRoomData = await Room.findOneAndUpdate(
      { roomName },
      { roomMembers: newRoomMembers },
      { new: true }
    );
    await Authentication.updateOne({ email: user.email }, { roomName });
    return res.json(finalRoomData);
  }
};

module.exports = joinRoomController;
