const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(
      "mongodb+srv://tushar:chatapp769843@chatapp.wlr6kkc.mongodb.net/chatapp?retryWrites=true&w=majority"
    );
    console.log(`mongo connected`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
module.exports = connectDB;
