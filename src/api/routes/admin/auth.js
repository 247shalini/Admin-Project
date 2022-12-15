const express = require("express");
const authController = require("../../controllers/adminAuth");

const authRouter = express.Router();

authRouter.post(
  "/login",
  authController.loginAction
);
authRouter.post(
  "/add-user",
  authController.addUser
);
authRouter.post("/delete/:id", authController.deleteUser);
authRouter.post("/update/:id", authController.updateUser);
authRouter.get("/user-list", authController.getUserList);
authRouter.get("/user-info", authController.getUserInfo);

module.exports = authRouter;
