const express = require("express");
const app = express();
const cors = require("cors");
const { router } = require("./router");

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(router);
module.exports = app;
