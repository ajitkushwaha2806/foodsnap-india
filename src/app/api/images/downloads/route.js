import dbConnect from "@/lib/dbConnect";
import Download from "@/models/Download";
import { getAuthUser } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser || !authUser.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Please sign in to view your downloaded images.",
          action: {
            redirect: "/login",
            buttonText: "Sign In",
            autoRedirect: true,
          },
        },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get("limit") || "12", 10)));
    const skip = (page - 1) * limit;

    const totalCount = await Download.countDocuments({ userId: authUser.userId });

    if (totalCount === 0) {
      return NextResponse.json(
        {
          success: true,
          downloads: [],
          pagination: {
            totalCount: 0,
            totalPages: 1,
            page,
            limit,
            hasNextPage: false,
            hasPrevPage: false,
          },
        },
        { status: 200 }
      );
    }

    const rawDownloads = await Download.find({ userId: authUser.userId })
      .populate({
        path: "imageId",
        select: "title description tags cuisine image_url optimised_image_url approved premium category food_type downloads",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Filter out any entries where the referenced image might have been deleted
    const validDownloads = rawDownloads.filter((d) => d.imageId !== null);

    const totalPages = Math.ceil(totalCount / limit) || 1;

    return NextResponse.json(
      {
        success: true,
        downloads: validDownloads,
        pagination: {
          totalCount,
          totalPages,
          page,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Get Downloaded Images API Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to fetch downloaded images.",
      },
      { status: 500 }
    );
  }
}
