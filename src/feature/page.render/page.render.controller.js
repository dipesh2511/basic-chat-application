import path from "path";

export default class PageRenderController{
    constructor(){}

    getIndexPage(req,res,next){
        let new_path = path.join(path.resolve(),"front.end.client","html","index.html");
        res.sendFile(new_path)
    }
    getRegisterPage(req,res,next){
        let new_path = path.join(path.resolve(),"front.end.client","html","register.html");
        res.sendFile(new_path)
    }
    getChatPage(req,res,next){
        let new_path = path.join(path.resolve(),"front.end.client","html","chat.html");
        res.sendFile(new_path)
    }
    getInfoPage(req,res,next){
        let new_path = path.join(path.resolve(),"front.end.client","html","info.html");
        res.sendFile(new_path)
    }
    getOtpPage(req,res,next){
        let new_path = path.join(path.resolve(),"front.end.client","html","otp.html");
        res.sendFile(new_path)
    }
}