// const jwt = require("jsonwebtoken");
import Jwt from "jsonwebtoken";
const createSession = ({ email }) => {
  return Jwt.sign({ email }, "JWT_SECRET");
};
const verify = (token) => {
  const dec = Jwt.verify(token, "JWT_SECRET");
  return dec;
};

module.exports = {
  createSession,
  verify,
};
