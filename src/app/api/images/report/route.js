import dbConnect from "@/lib/dbConnect";
import ImageModel from "@/models/Image";
import { NextResponse } from "next/server";
import { invalidateImageCache } from "@/lib/api/redis";
import { validateRequiredFields } from "@/lib/api/helper";

export async function POST(request) {
  try {
    const body = await request.json();
    validateRequiredFields(body, ["imageId"]);

    const { imageId } = body;

    await dbConnect();

    const updatedImage = await ImageModel.findByIdAndUpdate(
      imageId,
      { approved: false },
      { new: true }
    );

    if (!updatedImage) {
      return NextResponse.json(
        { success: false, message: "Image not found." },
        { status: 404 }
      );
    }

    await invalidateImageCache(imageId);

    return NextResponse.json({
      success: true,
      message: "Image reported successfully",
      imageId: updatedImage._id,
      approved: updatedImage.approved,
    });
  } catch (error) {
    console.error("[Report Image Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to report image.",
      },
      { status: error?.message?.startsWith("Missing required fields") ? 400 : 500 }
    );
  }
}
