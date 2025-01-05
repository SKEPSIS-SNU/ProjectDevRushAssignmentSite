import mongoose, { Schema, Document } from "mongoose";
import { ISubmission } from "@/interfaces";

export interface SubmissionDocument extends ISubmission, Document {}

const submissionSchema = new Schema<SubmissionDocument>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    status: { type: Number, required: true },
    links: {
      github: { type: String, required: true },
      kaggle: { type: String, required: true },
      website: { type: String, required: true },
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

export const Submission =
  mongoose.models.Submission ||
  mongoose.model<SubmissionDocument>("Submission", submissionSchema);
