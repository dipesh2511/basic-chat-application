import "./env.js";
import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";

import { mongoDbConnect } from "./src/config/mongodb.config.js";
import { corsOptions } from "./src/config/cors.config.js";
import { MongoServerError } from "mongodb";

import userRouter from "./src/feature/user/user.router.js";
import privateChatRouter from "./src/feature/private.chat/private.chat.router.js";
import ApplicationLevelError from "./src/custom.error.logs.reponses/application.level.error.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join("front.end.client", "views")));
app.use(cors(corsOptions));

// router endpoints here
app.use("/api/user", userRouter);
app.use("/api/chat",privateChatRouter);


app.use((error, req, res, next) => {
  if (error instanceof ApplicationLevelError) {
    let genericError = new ApplicationLevelError(
      error.message,
      error.status_code,
      error.error_message,
      error.error_type
    );
    
    return res
      .status(500)
      .send(ApplicationLevelError.getErrorMessage(genericError));
  }

  if (error instanceof MongoServerError) {
    let genericError = new ApplicationLevelError(
      error.message,
      error.status_code,
      error.error_message,
      error.error_type
    );
    return res
      .status(500)
      .send(ApplicationLevelError.getErrorMessage(genericError));
  }
  console.log(error)
  res.status(500).send({ message: "Internal Server Error" });
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await mongoDbConnect();
});
