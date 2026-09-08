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

    const { name, phone, password } = body;
    const cleanPhone = String(phone).trim();
    const cleanPassword = String(password).trim();
    const cleanName = String(name || "").trim();

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid 10-digit number." },
        { status: 400 }
      );
    }

    if (cleanPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ phone: cleanPhone });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "An account with this phone number already exists. Please sign in." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(cleanPassword, 10);

    const newUser = await User.create({
      name: cleanName || `Foodie_${cleanPhone.slice(-4)}`,
      phone: cleanPhone,
      password: hashedPassword,
      credits: 0,
      subscription: {
        isActive: false,
        expiresAt: null,
        plan: "free",
      },
      totalImagesDownloaded: 0,
    });

    const token = signToken(newUser);

    const userPayload = {
      _id: newUser._id,
      name: newUser.name,
      phone: newUser.phone,
      credits: newUser.credits,
      subscription: newUser.subscription,
      totalImagesDownloaded: newUser.totalImagesDownloaded,
      createdAt: newUser.createdAt,
    };

    const response = NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        token,
        user: userPayload,
      },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, 
    });

    return response;
  } catch (error) {
    console.error("[Register API Error]:", error);
    const isValidationError = error?.message?.startsWith("Missing required fields");
    return NextResponse.json(
      { success: false, message: error?.message || "Registration failed. Please try again." },
      { status: isValidationError ? 400 : 500 }
    );
  }
}
