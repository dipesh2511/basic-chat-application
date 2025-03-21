import "./env.js";
import http from "http";
import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";

import { mongoDbConnect } from "./src/config/mongodb.config.js";
import { corsOptions } from "./src/config/cors.config.js";
import { MongoServerError } from "mongodb";
import { Server } from "socket.io";

import userRouter from "./src/feature/user/user.router.js";
import privateChatRouter from "./src/feature/private.chat/private.chat.router.js";
import pageRenderRouter from "./src/feature/page.render/page.render.router.js";

import ApplicationLevelError from "./src/custom.error.logs.reponses/application.level.error.js";
import { config_variables } from "./front.end.client/views/js/config.js";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join("front.end.client", "views")));
app.use(express.static(path.join("profile.pictures")));
app.use(express.static(path.join("default.files")));
app.use(cors(corsOptions));

// creating socket Server
const io = new Server(server, {
  cors: corsOptions,
});

io.on("connection", (socket) => {
  console.log("socket connection established");

  // Saving new message in the database
  socket.on("new_message", async (message_obj) => {
    try {
      const serverUrl = process.env.SERVER_URL || "http://localhost:3000";
      const new_message_call = await fetch(`${serverUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message_obj),
      });
  
      // Check if the response is JSON
      const contentType = new_message_call.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await new_message_call.text();
        throw new Error(`Unexpected response: ${responseText}`);
      }
  
      // Parse the response as JSON
      const new_message = await new_message_call.json();
  
      // Broadcast the new message to all connected clients
      io.emit("add_message", new_message);
      console.log("Message broadcasted:", new_message); // Debugging
    } catch (error) {
      console.error("Error saving or broadcasting message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("connection is disconnected");
  });
});
// router endpoints here
app.use("/", pageRenderRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", privateChatRouter);

// error handler application level Middleware
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
  console.log(error);
  res.status(500).send({ message: "Internal Server Error" });
});

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await mongoDbConnect();
});
