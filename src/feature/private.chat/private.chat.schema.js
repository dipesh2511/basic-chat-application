import { Schema } from "mongoose";
export const PrivateChatSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  message: {
    type: String,
    required: true,
  },
  posted_on: {
    type: Date,
    default: Date.now,
  },
});
