import User from "@/models/User";
import Ticket from "@/models/Ticket";
import dbConnect from "@/lib/dbConnect";
import { getAuthUser } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();

    const authUser = getAuthUser(request);
    const userId = authUser?.userId || null;
    const body = await request.json().catch(() => ({}));

    let { name, email, phone, subject, message } = body;

    if (userId) {
      const user = await User.findById(userId).lean();
      if (user) {
        if (!name) name = user.name;
        if (!phone) phone = user.phone;
        if (!email && user.email) email = user.email;
      }
    }

    name = String(name || "").trim();
    phone = String(phone || "").trim();
    email = String(email || "").trim();
    subject = String(subject || "").trim();
    message = String(message || "").trim();

    if (!name || !phone || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill in all required fields (name, phone, email, subject, message).",
        },
        { status: 400 }
      );
    }

    const newTicket = await Ticket.create({
      user: userId,
      status: "open",
      priority: "medium",
      details: {
        name,
        phone,
        email,
        subject,
        message,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your support request has been submitted successfully.",
        ticket: newTicket,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Ticket Creation API Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Something went wrong while submitting your ticket.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await dbConnect();

    const authUser = getAuthUser(request);
    const userId = authUser?.userId;

    if (!userId) {
      return NextResponse.json(
        {
          success: true,
          tickets: [],
        },
        { status: 200 }
      );
    }

    const tickets = await Ticket.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: "Tickets fetched successfully.",
        tickets,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Ticket Fetch API Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to load support tickets.",
      },
      { status: 500 }
    );
  }
}
