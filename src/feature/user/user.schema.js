import { Schema } from "mongoose";
export const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    default: null,
  },
  otp_expiry: {
    type: Date,
    default: null,
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  group_text: [
    {
      type: Schema.Types.ObjectId,
      ref: "group_chats",
    },
  ],
  private_text: [
    {
      type: Schema.Types.ObjectId,
      ref: "private_chats",
    },
  ],
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
});
