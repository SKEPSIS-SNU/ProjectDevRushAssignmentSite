import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "@/interfaces";

export interface UserDocument extends IUser, Document {}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    submissions: [{ type: Schema.Types.ObjectId, ref: "Submission" }],
    track: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const User =
  mongoose.models.User || mongoose.model<UserDocument>("User", userSchema);
