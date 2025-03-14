import "./env.js";
import express from "express";
import path from "path";
import { mongoDbConnect } from "./src/config/mongodb.config.js";
import userRouter from "./src/feature/user/user.router.js";
import cors from "cors";
import { corsOptions } from "./src/config/cors.config.js";
import { MongoServerError } from "mongodb";
import ApplicationLevelError from "./src/custom.error.logs.reponses/application.level.error.js";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join("front.end.client", "views")));
app.use(cors(corsOptions));

// router endpoints here
app.use("/api/user", userRouter);


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
  res.status(500).send({ message: "Internal Server Error" });
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await mongoDbConnect();
});
