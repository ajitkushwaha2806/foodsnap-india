import { getAuthUser } from "@/lib/jwt";
import { NextResponse } from "next/server";
import { plans, services, photoUploadPlans, fssaiPlans } from "@/constants";
import { getRazorpayClient } from "@/lib/razorpay";

export async function POST(request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser || !authUser.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Please sign in to proceed with checkout.",
          action: { redirect: "/login", buttonText: "Sign In", autoRedirect: true },
        },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { planKey, customAmount, tier, includeUploadAddon } = body;

    let targetItem = plans.find((p) => p.key === planKey);
    if (!targetItem) {
      targetItem = services.find((s) => s.key === planKey);
    }
    if (!targetItem && Array.isArray(photoUploadPlans)) {
      targetItem = photoUploadPlans.find((p) => p.key === planKey);
    }
    if (!targetItem && Array.isArray(fssaiPlans)) {
      targetItem = fssaiPlans.find((p) => p.key === planKey);
    }

    let amountInPaise;
    if (targetItem) {
      let finalAmount = targetItem.discountedAmount || targetItem.amount || 499;
      if (tier && tier.amount && Number(tier.amount) > 0) {
        finalAmount = Number(tier.amount);
      }
      if (includeUploadAddon) {
        finalAmount += 1000;
      }
      amountInPaise = Math.round(finalAmount * 100);
    } else if (customAmount && Number(customAmount) >= 1) {
      amountInPaise = Math.round(Number(customAmount) * 100);
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid plan or amount selected." },
        { status: 400 }
      );
    }

    if (amountInPaise < 100) {
      return NextResponse.json(
        { success: false, message: "Minimum transaction amount is ₹1.00 (100 paise)." },
        { status: 400 }
      );
    }

    const razorpay = getRazorpayClient();
    const receipt = `rcpt_${authUser.userId.slice(-6)}_${Date.now().toString().slice(-6)}`;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt,
      notes: {
        userId: authUser.userId,
        planKey: planKey || "custom",
        tierLabel: tier ? tier.label || `${tier.items} items` : "",
        tierAmount: tier ? String(tier.amount) : "",
        includeUploadAddon: Boolean(includeUploadAddon),
      },
    });

    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      planKey: planKey || "custom",
    });
  } catch (error) {
    console.error("[Razorpay Create Order Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to create Razorpay order.",
      },
      { status: 500 }
    );
  }
}
