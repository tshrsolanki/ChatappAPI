const Authentication = require("../MODEL/authenticationModel");
const lodash = require("lodash");
const bycrypt = require("bcrypt-nodejs");
const { createSession } = require("../session");
const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const data = await Authentication.findOne(
      {
        email,
      },
      {
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
        _id: 0,
      }
    );
    if (!data) {
      res.json({ success: false, message: "Wrong Credentials" });
    } else {
      let userData = data.toJSON();
      const valid = bycrypt.compareSync(password, userData.password);
      if (valid) {
        userData = lodash.omit(userData, "password");
        const user = await createSession(userData);
        res.json({ user, success: true });
      } else {
        res.json({ success: false, message: "Wrong Credentials" });
      }
    }
  } catch (error) {
    console.log(error, "||", "authenticationController.js", "line-", 28);
    res.json({ success: false, message: "Something went wrong" });
  }
};
const signupController = async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const hash = bycrypt.hashSync(password);
    const data = await Authentication.findOne({
      email,
    });
    if (!data) {
      const newdata = await Authentication.create({
        email,
        password: hash,
        username,
      });
      const temp = lodash.omit(
        newdata.toJSON(),
        "password",
        "_id",
        "createdAt",
        "updatedAt",
        "__v"
      );
      const user = await createSession(temp);
      res.json({ user: { ...user }, success: true });
    } else {
      res.json({ success: false, message: "Email already exists" });
    }
  } catch (error) {
    res.json({ success: false, message: "Something went wrong" });
    console.log(error);
  }
};
module.exports = {
  loginController,
  signupController,
};
