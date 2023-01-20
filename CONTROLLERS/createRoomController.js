const Room = require("../MODEL/roomModel");
const { roomNameGenerator } = require("../idGenerator.js");
const lodash = require("lodash");
const Authentication = require("../MODEL/authenticationModel");

const createRoomController = async (req, res) => {
  const { roomName, user } = req.body;
  try {
    while (true) {
      const newRoomName = `${roomName}${roomNameGenerator()}`;
      const room = await Room.findOne(
        { roomName: newRoomName },
        {
          roomAdmin: 0,
          roomMembers: 0,
        }
      );

      if (!room) {
        const roomMembers = [user.username];
        const roomData = await Room.create({
          roomName: newRoomName,
          roomAdmin: user.email,
          roomMembers,
        });
        await Authentication.updateOne(
          { email: user.email },
          {
            roomName: newRoomName,
          }
        );
        const finalRoomData = lodash.omit(roomData.toJSON(), "_id", "__v");
        res.json(finalRoomData);
        break;
      }
    }
  } catch (error) {
    res.json({ message: "Something went wrong", success: false });
    console.log(error, "||", "createRoomController.js", "line-", 47);
  }
};
module.exports = createRoomController;
