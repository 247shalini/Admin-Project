const { Router } = require("express");
const authRouter = require("./auth");

const adminRouter = Router();

adminRouter.use("/", authRouter);

module.exports = adminRouter;
