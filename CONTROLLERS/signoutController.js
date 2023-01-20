const { deleteSession } = require("../session");

const signoutController = async (req, res) => {
  const { authorization } = req.headers;
  deleteSession(authorization);
};
module.exports = signoutController;
