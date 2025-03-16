import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default class UserModel {
  constructor(name, email, password,profile_photo) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.otp = null;
    this.otp_expiry = null;
    this.is_verified = false;
    this.profile_photo = profile_photo;
    this.group_text = [];
    this.private_text = [];
    this.friends = [];
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  static create(name, email, password,profile_photo) {
    let new_user = new UserModel(name, email, password,profile_photo);
    return new_user;
  }

  static read() {}

  static list() {}

  static update() {}

  static delete() {}

  static generateOtp() {}

  static verifyOtp() {}
  static bcryptPassword(password) {}

  static login(name, user_id,email) {
    let token = jwt.sign(
      {
        name: name,
        user_id: user_id,
        email : email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1year",
      }
    );
    return token;
  }
}
