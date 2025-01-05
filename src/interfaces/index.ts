import { Types } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  submissions: Types.ObjectId[];
  track: string;
}

export interface IAssignment {
  title: string;
  description: string;
  track: string;
  userSubmission: Types.ObjectId[];
}

export interface ISubmission {
  assignmentId: Types.ObjectId;
  status: number;
  links: {
    github: string;
    kaggle: string;
    website: string;
  };
  userId: Types.ObjectId;
}
