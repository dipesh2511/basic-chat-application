import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import ApplicationLevelResponse from "../../custom.error.logs.reponses/application.level.response.js";
import { UserSchema } from "./user.schema.js";
import ApplicationLevelError from "../../custom.error.logs.reponses/application.level.error.js";
export default class UserRepository {
  constructor() {
    this.UserModel = mongoose.model("users", UserSchema);
  }

  async create(new_user) {
    try {
      let user = new this.UserModel(new_user);
      let result = await user.save();

      return new ApplicationLevelResponse(
        "User created successfully",
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

  async list() {}

  async read(id) {
    try {
      let user = await this.UserModel.findOne({
        _id: new ObjectId(id),
      }).populate("friends");

      if (!user) {
        throw new ApplicationLevelError(
          "No user present in database",
          404,
          "Provide valid user",
          "Bad Request"
        );
      }
      return new ApplicationLevelResponse(
        "User Fetched Successfully",
        200,
        user
      );
    } catch (error) {
      throw new ApplicationLevelError(
        error.message || "data base error",
        error.status_code || 500,
        error.error_message || error.message,
        error.error_type || "Data Base Error"
      );
    }
  }

  async update(id, updateUserBody) {
    try {
      let user = await this.UserModel.findOne({ _id: new ObjectId(id) });

      if (!user) {
        throw new ApplicationLevelError(
          error.message,
          404,
          "User Not Found",
          "Bad Request"
        );
      }

      if (updateUserBody.friends) {
        updateUserBody.friends.forEach((friend) => {
          if (!user.friends.includes(friend)) {
            user.friends.push(friend);
          }
        });
      }

      Object.keys(updateUserBody).forEach((key) => {
        if (key !== "friends") {
          user[key] = updateUserBody[key];
        }
      });

      let result = await user.save();

      return new ApplicationLevelResponse(
        "User Updated Successfully",
        200,
        result
      );
    } catch (error) {
      throw new ApplicationLevelError(
        error.message || error,
        error.status_code || 500,
        error.error_message || error.message,
        error.error_type || "Data Base Error"
      );
    }
  }

  async delete() {}

  async generateOtp() {}

  async verifyOtp() {}

  async login(email, password) {
    try {
      let user = await this.UserModel.findOne({
        email: email,
        password: password,
      }).select("-password");

      if (!user) {
        throw new ApplicationLevelError(
          null,
          404,
          "User not found",
          "User not found"
        );
      }

      return new ApplicationLevelResponse(
        "User logged in successfully",
        200,
        user
      );
    } catch (error) {
      throw new ApplicationLevelError(
        error.message || "data base error",
        error.status_code || 500,
        error.error_message || error.message,
        error.error_type || "Data Base Error"
      );
    }
  }
}
