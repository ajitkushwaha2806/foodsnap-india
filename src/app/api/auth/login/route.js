import bcrypt from "bcryptjs";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { validateRequiredFields } from "@/lib/api/helper";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    validateRequiredFields(body, ["phone", "password"]);

    const { phone, password } = body;
    const cleanPhone = String(phone).trim();
    const cleanPassword = String(password).trim();

    const user = await User.findOne({ phone: cleanPhone });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "No account found with this phone number. Please sign up." },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(cleanPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    const token = signToken(user);

    const userPayload = {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      credits: user.credits,
      subscription: user.subscription,
      totalImagesDownloaded: user.totalImagesDownloaded,
      createdAt: user.createdAt,
    };

    const displayName = user.name?.trim() || `Foodie_${user.phone.slice(-4)}`;

    const response = NextResponse.json({
      success: true,
      message: `Welcome back, ${displayName}!`,
      token,
      user: userPayload,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.error("[Login API Error]:", error);
    const isValidationError = error?.message?.startsWith("Missing required fields");
    return NextResponse.json(
      { success: false, message: error?.message || "Sign in failed. Please try again." },
      { status: isValidationError ? 400 : 500 }
    );
  }
}
