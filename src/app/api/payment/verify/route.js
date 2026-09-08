import User from "@/models/User";
import { plans } from "@/constants";
import dbConnect from "@/lib/dbConnect";
import { getAuthUser } from "@/lib/jwt";
import { NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay"

export async function POST(request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser || !authUser.userId) {
      return NextResponse.json(
        { success: false, message: "Please sign in to verify your payment." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planKey,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required Razorpay payment verification fields.",
        },
        { status: 400 }
      );
    }

    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment verification failed. Invalid signature.",
        },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findById(authUser.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User account not found." },
        { status: 404 }
      );
    }

    const planObj = plans.find((p) => p.key === planKey);
    let creditsToAdd = 0;
    let planDurationDays = 30;

    if (planObj) {
      if (typeof planObj.downloads === "number") {
        creditsToAdd = planObj.downloads;
      } else if (planObj.downloads === "unlimited") {
        creditsToAdd = 9999;
      }
      planDurationDays = planObj.duration || 30;
    }

    user.credits = (user.credits || 0) + creditsToAdd;
    user.subscription = {
      isActive: true,
      plan: planKey || user.subscription?.plan || "pro",
      expiresAt: new Date(Date.now() + planDurationDays * 24 * 60 * 60 * 1000),
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    };

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Payment verified and subscription activated successfully!",
      credits: user.credits,
      subscription: user.subscription,
    });
  } catch (error) {
    console.error("[Razorpay Payment Verification Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Internal error during payment verification.",
      },
      { status: 500 }
    );
  }
}
