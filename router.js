const express = require("express");
const router = express.Router();
const {
  loginController,
  signupController,
} = require("./CONTROLLERS/authenticationController");
const createRoomController = require("./CONTROLLERS/createRoomController");
const joinRoomController = require("./CONTROLLERS/joinRoomController");
const signoutController = require("./CONTROLLERS/signoutController");
const { getAuthTokenId } = require("./session");

router.get("/", (req, res) => {
  res.send("hello");
});

router.post("/login", loginController);
router.post("/tokenlogin", getAuthTokenId);
router.post("/signup", signupController);
router.post("/join", joinRoomController);
router.post("/create", createRoomController);
router.post("/signout", signoutController);

module.exports = { router };
