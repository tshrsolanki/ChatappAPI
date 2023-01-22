const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(
      ""
    );
    console.log(`mongo connected`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
module.exports = connectDB;
