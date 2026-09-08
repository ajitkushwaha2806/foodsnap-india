import User from "@/models/User";
import { getAuthUser } from "@/lib/jwt";
import dbConnect from "@/lib/dbConnect";
import ImageModel from "@/models/Image";
import Download from "@/models/Download";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  return handleDownload(request, params);
}

export async function POST(request, { params }) {
  return handleDownload(request, params);
}

async function handleDownload(request, params) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser || !authUser.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Please sign in first to download images.",
          action: {
            redirect: "/login",
            buttonText: "Sign In",
            autoRedirect: true,
          },
        },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const imageId = resolvedParams?.id;

    if (!imageId) {
      return NextResponse.json(
        { success: false, message: "Missing required image ID." },
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

    const image = await ImageModel.findById(imageId).lean();
    if (!image) {
      return NextResponse.json(
        { success: false, message: "Image not found." },
        { status: 404 }
      );
    }

    const existingDownload = await Download.findOne({
      userId: user._id,
      imageId: image._id,
    });

    if (existingDownload) {
      return NextResponse.json({
        success: true,
        message: "Download ready (already unlocked)",
        imageUrl: image.image_url,
        optimisedImageUrl: image.optimised_image_url,
        title: image.title,
        imageId: image._id,
        remainingCredits: user.credits,
        alreadyDownloaded: true,
      });
    }

    if ((user.credits ?? 0) <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "You have no download credits left. Please recharge your credits to download.",
          credits: 0,
          action: {
            redirect: "/pricing",
            buttonText: "Recharge",
            autoRedirect: true,
          },
        },
        { status: 403 }
      );
    }

    await Download.create({
      userId: user._id,
      imageId: image._id,
    });

    user.credits = Math.max(0, (user.credits || 0) - 1);
    user.totalImagesDownloaded = (user.totalImagesDownloaded || 0) + 1;
    await user.save();
    await ImageModel.findByIdAndUpdate(imageId, { $inc: { downloads: 1 } });

    return NextResponse.json({
      success: true,
      message: "Download ready",
      imageUrl: image.image_url,
      optimisedImageUrl: image.optimised_image_url,
      title: image.title,
      imageId: image._id,
      remainingCredits: user.credits,
      alreadyDownloaded: false,
    });
  } catch (error) {
    console.error("[Image Download API Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to process image download.",
      },
      { status: 500 }
    );
  }
}
