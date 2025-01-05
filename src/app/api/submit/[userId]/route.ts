import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { Submission } from "@/models/submission.model";
import dbConnect from "@/lib/dbConnect";

export async function GET(
  _request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnect();
    const { userId } = await params;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid userId format",
        },
        { status: 400 }
      );
    }

    // Use aggregation to get submissions with assignment details
    const submissions = await Submission.aggregate([
      // Match submissions for the specific user
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      // Lookup assignment details
      {
        $lookup: {
          from: "assignments",
          localField: "assignmentId",
          foreignField: "_id",
          as: "assignment",
        },
      },
      // Unwind the assignment array created by lookup
      {
        $unwind: "$assignment",
      },
      // Project only the fields we need
      {
        $project: {
          _id: 1,
          status: 1,
          links: 1,
          createdAt: 1,
          "assignment._id": 1,
          "assignment.title": 1,
          "assignment.description": 1,
          "assignment.track": 1,
        },
      },
      // Sort by creation date, newest first
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    if (!submissions.length) {
      return NextResponse.json(
        {
          success: true,
          message: "No submissions found for this user",
          data: {
            submissions: [],
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Submissions fetched successfully",
        data: {
          submissions: submissions.map((submission) => ({
            id: submission._id,
            status: submission.status,
            links: submission.links,
            createdAt: submission.createdAt,
            assignment: {
              id: submission.assignment._id,
              title: submission.assignment.title,
              description: submission.assignment.description,
              track: submission.assignment.track,
            },
          })),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get submissions error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
