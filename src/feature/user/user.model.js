import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default class UserModel {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.otp = null;
    this.otp_expiry = null;
    this.is_verified = false;
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  static create(name, email, password) {
    let new_user = new UserModel(name, email, password);
    return new_user;
  }

  static read() {}

  static list() {}

  static update() {}

  static delete() {}

  static generateOtp() {}

  static verifyOtp() {}
  static bcryptPassword(password) {}

  static login(name, user_id, password) {
    let token = jwt.sign(
      {
        name: name,
        user_id: user_id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1year",
      }
    );
    return token;
  }
}
