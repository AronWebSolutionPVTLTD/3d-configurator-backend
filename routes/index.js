const express = require("express");
const allRouter = express.Router();
const { userRouter } = require("./auth/configurator");
const merchantRoutes = require("./routes");

allRouter.use("/configuration", userRouter);

//merchant manage
allRouter.use("/merchant", merchantRoutes);

module.exports = allRouter;
