import mongoose, { Schema, Document } from "mongoose";
import { IAssignment } from "@/interfaces";

export interface AssignmentDocument extends IAssignment, Document {}

const assignmentSchema = new Schema<AssignmentDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    track: { type: String, required: true },
    userSubmission: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

export const Assignment =
  mongoose.models.Assignment ||
  mongoose.model<AssignmentDocument>("Assignment", assignmentSchema);
