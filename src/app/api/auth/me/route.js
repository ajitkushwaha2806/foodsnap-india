import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { getAuthUser } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const authData = getAuthUser(request);
    if (!authData || !authData.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Please sign in to access your account.",
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await dbConnect();
    const user = await User.findById(authData.userId).select("-password").lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("[Auth /me Error]:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch user session." },
      { status: 500 }
    );
  }
}
