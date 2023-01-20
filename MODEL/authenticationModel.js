const mongoose = require("mongoose");

const authenticationSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    roomName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Authentication = mongoose.model("authentication", authenticationSchema);
module.exports = Authentication;
