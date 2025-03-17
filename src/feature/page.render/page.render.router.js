import express from "express";
import PageRenderController from "./page.render.controller.js";

let pageRenderRouter = express.Router();
let pageRenderController = new PageRenderController();

pageRenderRouter.get("/", (req, res, next) => {
    pageRenderController.getIndexPage(req,res,next);
});
pageRenderRouter.get("/register", (req, res, next) => {
    pageRenderController.getRegisterPage(req,res,next);
});
pageRenderRouter.get("/chat", (req, res, next) => {
    pageRenderController.getChatPage(req,res,next);
});
pageRenderRouter.get("/info", (req, res, next) => {
    pageRenderController.getInfoPage(req,res,next);
});
pageRenderRouter.get("/otp", (req, res, next) => {
    pageRenderController.getOtpPage(req,res,next);
});
export default pageRenderRouter;
