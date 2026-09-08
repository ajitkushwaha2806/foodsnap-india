import mongoose from "mongoose";

const DownloadSchema = new mongoose.Schema(
  {
    imageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

DownloadSchema.index({ userId: 1, imageId: 1 }, { unique: true });

const Download = mongoose.models.Download || mongoose.model("Download", DownloadSchema);
export default Download;
