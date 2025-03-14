import { Schema } from "mongoose";

export const GroupChatSchema = new Schema({

  group_name: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  posted_by: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },

  posted_on: {
    type: Date,
    default: Date.now, 
  },
  
  group_members: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
});