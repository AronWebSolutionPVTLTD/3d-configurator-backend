const express = require("express");
const allRouter = express.Router();
const { userRouter } = require("./auth/configurator");

allRouter.use("/configuration", userRouter);

module.exports = allRouter;