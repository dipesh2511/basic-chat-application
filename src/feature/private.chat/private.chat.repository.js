import mongoose from "mongoose";
import ApplicationLevelError from "../../custom.error.logs.reponses/application.level.error.js";
import ApplicationLevelResponse from "../../custom.error.logs.reponses/application.level.response.js";
import { PrivateChatSchema } from "./private.chat.schema.js";
import { UserSchema } from "../user/user.schema.js";
import { ObjectId } from "mongodb";

export default class PrivateChatRepository {
  constructor() {
    this.PrivateChatModel = mongoose.model("private_chats", PrivateChatSchema);
    this.UserModel = mongoose.model("users", UserSchema);
  }

  async create(new_chat) {
    try {
      let chat = new this.PrivateChatModel(new_chat);
      let result = await chat.save();
      let users = await this.UserModel.updateMany(
        {
          _id: { $in: [new_chat.sender, new_chat.receiver] },
        },
        {
          $push: {
            private_text: new ObjectId(result._id),
          },
        }
      );
      return new ApplicationLevelResponse(
        "Chat created successfully",
        201,
        result
      );
    } catch (error) {
      // MongoDB duplicate key error code
      if (error.code === 11000) {
        throw new ApplicationLevelError(
          error,
          400,
          error.message,
          "Mongoose duplicate key error"
        );
      }

      throw new ApplicationLevelError(
        error,
        500,
        error.message,
        "Data Base Error"
      );
    }
  }

  async list(persons) {
    try {
      let chats = await this.PrivateChatModel.find({
        $or: [
          {
            $and: [
              { sender: new ObjectId(persons[0]) },
              { receiver: new ObjectId(persons[1]) },
            ],
          },
          {
            $and: [
              { sender: new ObjectId(persons[1]) },
              { receiver: new ObjectId(persons[0]) },
            ],
          },
        ],
      });
      if (!chats) {
        return new ApplicationLevelResponse("No Chat founded", 200, null);
      }
      return new ApplicationLevelResponse(
        "Chat founded successfully",
        200,
        chats
      );
    } catch (error) {
      throw new ApplicationLevelError(
        error,
        500,
        error.message,
        "Data Base Error"
      );
    }
  }

  async get() {}

  async update() {}

  async delete() {}
}
