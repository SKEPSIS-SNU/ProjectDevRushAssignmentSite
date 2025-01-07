import { NextRequest, NextResponse } from "next/server";
import { Assignment } from "@/models/assignment.model";
import dbConnect from "@/lib/dbConnect";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const track = request.nextUrl.searchParams.get("track");

    if (!track) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required query parameter: track",
        },
        { status: 400 }
      );
    }

    const assignments = await Assignment.find({ track });

    if (assignments.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No assignments found for the specified track",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Assignments retrieved successfully",
        data: assignments.map((assignment) => ({
          id: assignment._id,
          title: assignment.title,
          description: assignment.description,
          track: assignment.track,
          userSubmission: assignment.userSubmission,
          createdAt: assignment.createdAt,
          updatedAt: assignment.updatedAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
