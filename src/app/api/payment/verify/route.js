import User from "@/models/User";
import Ticket from "@/models/Ticket";
import dbConnect from "@/lib/dbConnect";
import { getAuthUser } from "@/lib/jwt";
import { NextResponse } from "next/server";
import { plans, services, photoUploadPlans, fssaiPlans } from "@/constants";
import { verifyRazorpaySignature } from "@/lib/razorpay";

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
      tier,
      includeUploadAddon,
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
    let serviceObj = services.find((s) => s.key === planKey);
    if (!serviceObj && Array.isArray(photoUploadPlans)) {
      serviceObj = photoUploadPlans.find((p) => p.key === planKey);
    }
    if (!serviceObj && Array.isArray(fssaiPlans)) {
      serviceObj = fssaiPlans.find((p) => p.key === planKey);
    }

    if (serviceObj) {
      const tierInfo = tier?.items
        ? ` (Tier: Up to ${tier.items} Items - ₹${Number(tier.amount).toLocaleString()})`
        : ` (${serviceObj.price})`;

      const newTicket = await Ticket.create({
        user: user._id,
        status: "open",
        priority: "high",
        details: {
          name: user.name || "Customer",
          phone: user.phone || "N/A",
          email: user.email || `${user.phone || "customer"}@foodsnap.in`,
          subject: `[Service Order] ${serviceObj.name}${tier?.items ? ` (Up to ${tier.items} Items)` : ""}`,
          message: `Service Purchased: ${serviceObj.name}${tierInfo}. Razorpay Order: ${razorpay_order_id}, Payment: ${razorpay_payment_id}. Please contact customer to collect menu/outlet details and execute service.`,
        },
      });

      return NextResponse.json({
        success: true,
        isService: true,
        message: `Payment successful! Your order for "${serviceObj.name}${tier?.items ? ` (Up to ${tier.items} Items)` : ""}" has been confirmed. Our team will contact you shortly.`,
        ticketId: newTicket._id,
      });
    }

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
    
    // Extend expiry if currently active
    const now = Date.now();
    let currentExpiry = user.subscription?.expiresAt 
      ? new Date(user.subscription.expiresAt).getTime() 
      : now;
      
    if (currentExpiry < now || !user.subscription?.isActive) {
      currentExpiry = now;
    }

    const newExpiry = new Date(currentExpiry + planDurationDays * 24 * 60 * 60 * 1000);

    user.subscription = {
      isActive: true,
      plan: planKey || user.subscription?.plan || "pro",
      expiresAt: newExpiry,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    };

    await user.save();
    if (includeUploadAddon) {
      let addonPrice = 1000;
      switch (planKey) {
        case "starter": addonPrice = 499; break;
        case "basic": addonPrice = 799; break;
        case "pro": addonPrice = 1199; break;
        case "premium": addonPrice = 1499; break;
      }
      await Ticket.create({
        user: user._id,
        status: "open",
        priority: "high",
        details: {
          name: user.name || "Customer",
          phone: user.phone || "N/A",
          email: user.email || `${user.phone || "customer"}@foodsnap.in`,
          subject: `[Photo Upload Add-on] ${planObj?.name || "Plan"} + Zomato/Swiggy Photo Upload (+₹${addonPrice.toLocaleString("en-IN")})`,
          message: `Customer subscribed to ${planObj?.name || "Plan"} and paid +₹${addonPrice.toLocaleString("en-IN")} for Done-For-You Photo Upload Add-on. Razorpay Order: ${razorpay_order_id}, Payment: ${razorpay_payment_id}. Please contact customer to collect Zomato/Swiggy outlet access and upload their selected photos.`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      isService: false,
      hasUploadAddon: Boolean(includeUploadAddon),
      message: includeUploadAddon
        ? `Payment verified! Your ${planObj?.name || "plan"} is active, and our team will contact you shortly to upload your photos to Zomato & Swiggy.`
        : "Payment verified and subscription activated successfully!",
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
