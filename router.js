const express = require("express");
const router = express.Router();
const { rooms, users } = require("./users");
const { createSession, verify } = require("./session.js");

router.get("/", (req, res) => {
  res.send("hello");
});
router.get("/test", (req, res) => {
  res.json({
    rooms,
    users,
  });
});

router.post("/login", (req, res) => {
  const { email } = req.body;
  console.log(email);
  // const token = createSession({ email });
  // res.json(token);
  res.json({ success: true });
});

router.post("/signin", (req, res) => {
  const { email } = req.body;
  const token = createSession({ email });
  res.json(token);
});
router.get("/validroom", (req, res) => {
  const { room } = req.query;

  const valid = rooms.find((i) => {
    return i.name === room;
  });

  if (valid) {
    return res.json({ status: false });
  }
  return res.json({ status: true });
});
router.get("/join/validroom", (req, res) => {
  const { room } = req.query;
  console.log(room);

  const valid = rooms.find((i) => {
    return i.name === room;
  });

  if (valid) {
    return res.json({ status: true });
  }
  return res.json({ status: false });
});

module.exports = { router };
