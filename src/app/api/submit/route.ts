// app/api/submissions/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { Submission } from "@/models/submission.model";
import { Assignment } from "@/models/assignment.model";
import { User } from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";

// Type for the request body
interface SubmissionRequest {
  assignmentId: string;
  userId: string;
  links: {
    github?: string;
    kaggle?: string;
    website?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Parse request body
    const body: SubmissionRequest = await request.json();
    const { assignmentId, userId, links } = body;

    // Validate required fields
    if (!assignmentId || !userId || !links) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (
      !mongoose.Types.ObjectId.isValid(assignmentId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return NextResponse.json(
        { error: "Invalid assignmentId or userId format" },
        { status: 400 }
      );
    }

    // Check if assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has already submitted this assignment
    const existingSubmission = await Submission.findOne({
      assignmentId: new mongoose.Types.ObjectId(assignmentId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (existingSubmission) {
      return NextResponse.json(
        { error: "User has already submitted this assignment" },
        { status: 400 }
      );
    }

    // Create new submission
    const submission = new Submission({
      assignmentId: new mongoose.Types.ObjectId(assignmentId),
      userId: new mongoose.Types.ObjectId(userId),
      status: 1, // You can define status codes based on your needs
      links: {
        github: links.github || "",
        kaggle: links.kaggle || "",
        website: links.website || "",
      },
    });

    // Save submission
    await submission.save();

    // Update user's submissions array
    await User.findByIdAndUpdate(userId, {
      $push: { submissions: submission._id },
    });

    // Update assignment's userSubmission array
    await Assignment.findByIdAndUpdate(assignmentId, {
      $push: { userSubmission: userId },
    });

    return NextResponse.json(
      {
        message: "Submission created successfully",
        submission,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
