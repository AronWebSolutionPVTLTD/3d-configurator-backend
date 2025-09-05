const express = require("express");
const allRouter = express.Router();
const merchantRoutes = require("./routes");


//merchant manage
allRouter.use("/merchant", merchantRoutes);

module.exports = allRouter;
