const jwt = require("jsonwebtoken");
const redis = require("redis");
const Authentication = require("./MODEL/authenticationModel");
const Room = require("./MODEL/roomModel");
const redisClient = redis.createClient();
const redisStart = async () => {
  await redisClient
    .connect()
    .then(() => {
      console.log("redis ready", "||", "sessions.js", "line-", 8);
    })
    .catch(() => {
      console.log("Redis connection error");
    });
};

const getAuthTokenId = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const email = await redisClient.get(authorization);
    if (email) {
      const tempUser = await Authentication.findOne(
        { email },
        { __v: 0, _id: 0, password: 0, updatedAt: 0, createdAt: 0 }
      );
      const user = tempUser.toJSON();
      if (user.roomName) {
        const tempRoomData = await Room.findOne(
          { roomName: user.roomName },
          { __v: 0, _id: 0 }
        );
        const roomData = tempRoomData.toJSON();
        return res.json({ user, roomData });
      }
      return res.json({ user });
    }
  } catch (error) {
    console.log(error, "||", "sessions.js", "line-", 33);
    return res.json("unauthorized");
  }
};

const createSession = async (user) => {
  const { email } = user;
  const token = jwt.sign({ email }, "JWT_SECRET", { expiresIn: "2 days" });

  await redisClient.set(token, email);
  return Object.assign(user, { token });
};

const deleteSession = async (token) => {
  await redisClient.del(token);
};

module.exports = {
  createSession,
  getAuthTokenId,
  deleteSession,
  redisStart,
};
