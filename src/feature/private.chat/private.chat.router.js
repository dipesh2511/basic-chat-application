import express from "express";
import PrivateChatController from "./private.chat.controller.js";

const privateChatRouter = express.Router();
const privateChatController = new PrivateChatController();

privateChatRouter.post("/", (req, res, next) => {
    privateChatController.create(req, res, next);
});
privateChatRouter.post("/history", (req, res, next) => {
  privateChatController.list(req, res, next);
});
privateChatRouter.get("/:id", (req, res, next) => {
  privateChatController.get(req, res, next);
});
privateChatRouter.patch("/:id", (req, res, next) => {
  privateChatController.update(req, res, next);
});
privateChatRouter.delete("/:id", (req, res, next) => {
  privateChatController.delete(req, res, next);
});

export default privateChatRouter;
