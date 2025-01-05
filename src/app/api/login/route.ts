// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { name, email } = await request.json();
    const user = await User.findOne({ name, email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User Found",
        data: { email, name, track: user.track, id: user._id },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
