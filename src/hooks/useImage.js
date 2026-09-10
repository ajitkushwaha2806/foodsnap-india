"use client";
import axios from "axios";
import { apiClient } from "@/lib/api-client";
import { promptLogin, promptPricing } from "@/lib/auth-helpers";
import { useUser } from "@/store/hooks/useUser";
import { useNotification } from "@/store/hooks/useNotification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import posthog from "posthog-js";
import { trackMetaCustomEvent } from "@/lib/meta-pixel";

export function useImage() {
  const queryClient = useQueryClient();
  const { fetchUser } = useUser();
  const { success, error: notifyError } = useNotification();

  const downloadMutation = useMutation({
    onMutate: (variables) => {
      posthog.capture("image_download_initiated", {
        image_id: variables.imageId,
        image_title: variables.title,
      });
    },
    mutationFn: async ({ imageId, title = "food-image" }) => {
      const res = await apiClient.get(`/api/images/${imageId}/download`);
      const { imageUrl } = res.data;

      if (!imageUrl) {
        throw new Error("Image download URL unavailable.");
      }
      
      const imageResponse = await axios.get(imageUrl, {
        responseType: "blob",
      });

      const blobUrl = window.URL.createObjectURL(new Blob([imageResponse.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      const cleanTitle = (title || "food-image").replace(/[^a-zA-Z0-9-_ ]/g, "").trim().replace(/\s+/g, "-");
      link.setAttribute("download", `${cleanTitle}.jpg`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);

      return res.data;
    },
    onSuccess: (data, variables) => {
      posthog.capture("image_downloaded", {
        image_id: variables.imageId,
        image_title: variables.title,
        already_downloaded: Boolean(data?.alreadyDownloaded),
        remaining_credits: data?.remainingCredits,
      });
      trackMetaCustomEvent("ImageDownload", {
        content_name: variables.title,
        content_id: variables.imageId,
      });
      success("Image downloaded successfully!");
      fetchUser?.();
    },
    onError: (err, variables) => {
      const status = err?.response?.status;
      const data = err?.response?.data;
      posthog.capture("image_download_failed", {
        image_id: variables?.imageId,
        status_code: status,
        error_message: data?.message || err?.message,
      });
      if (status === 401) {
        promptLogin({
          actionName: "download this image",
          duration: 4000,
        });
      } else if (
        status === 403 ||
        data?.credits === 0 ||
        (typeof data?.message === "string" && data.message.toLowerCase().includes("credits"))
      ) {
        promptPricing({
          message: data?.message || "You have no download credits left. Please recharge your credits to download.",
          duration: 4000,
        });
      } else {
        notifyError(data?.message || err?.message || "Failed to download image");
      }
    },
  });

  const reportMutation = useMutation({
    mutationFn: async (imageId) => {
      const res = await apiClient.post("/api/images/report", { imageId });
      return res.data;
    },
    onSuccess: (data, imageId) => {
      posthog.capture("image_reported", { image_id: imageId });
      success("Image reported and removed from approved library.");
      queryClient.invalidateQueries({ queryKey: ["images_search"] });
    },
    onError: (err, imageId) => {
      posthog.capture("image_report_failed", {
        image_id: imageId,
        error_message: err?.response?.data?.message || err?.message,
      });
      notifyError(err?.response?.data?.message || "Failed to report image");
    },
  });

  return {
    handleDownloadImage: (imageId, title) =>
      downloadMutation.mutateAsync({ imageId, title }),
    handleReportImage: (imageId) => reportMutation.mutateAsync(imageId),
    isDownloading: downloadMutation.isPending,
    isReporting: reportMutation.isPending,
  };
}

export { useDownloadedImages } from "./useDownloadedImages";
export default useImage;
