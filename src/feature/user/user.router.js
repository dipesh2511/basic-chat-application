import express from "express";
import UserController from "./user.controller.js";
import { upload } from "../../config/multer.config.js";
import { jwtValidation } from "../../middleware/jwt.auth.middleware.js";

let userRouter = express.Router();
let userController = new UserController();

userRouter.post("/", upload.single("profile_photo"), (req, res, next) => {
  userController.create(req, res, next);
});
userRouter.get("/", jwtValidation, (req, res, next) => {
  userController.list(req, res, next);
});
userRouter.get("/:id", (req, res, next) => {
  userController.read(req, res, next);
});
userRouter.patch("/:id", upload.single("profile_photo"), (req, res, next) => {
  userController.update(req, res, next);
});
userRouter.delete("/:id", (req, res, next) => {
  userController.delete(req, res, next);
});
userRouter.post("/generate-otp", (req, res, next) => {
  userController.generateOtp(req, res, next);
});
userRouter.post("/verify-otp", (req, res, next) => {
  userController.verifyOtp(req, res, next);
});
userRouter.post("/login", (req, res, next) => {
  userController.login(req, res, next);
});

export default userRouter;
