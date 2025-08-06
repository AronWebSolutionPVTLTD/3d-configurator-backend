const express = require("express");
const allRouter = express.Router();
const {configurator} = require("../routes/auth/configurator")

allRouter.use("/configuration", configurator);

module.exports = {}