"use client";
import { useImage } from "@/hooks/useImage";
import { useUser } from "@/store/hooks/useUser";
import { Button } from "@/components/ui/button";
import { promptLogin } from "@/lib/auth-helpers";
import React, { useState, useEffect } from "react";
import { ImageIcon, Download, MessageSquareWarning, Loader2, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const ImageCard = ({ title = "", name = "", img = "", image_url = "", optimisedImg = "", optimised_image_url = "", imageId = "", premium = false }) => {
  const { handleDownloadImage, handleReportImage } = useImage();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const { user, isAuthenticated } = useUser();

  const displayTitle = title || name || "Food Photo";
  const rawMasterUrl = img || image_url;
  const rawOptimisedUrl = optimisedImg || optimised_image_url;
  const [currentSrc, setCurrentSrc] = useState(rawOptimisedUrl || rawMasterUrl);

  useEffect(() => {
    setCurrentSrc(rawOptimisedUrl || rawMasterUrl);
  }, [rawOptimisedUrl, rawMasterUrl]);

  const handleImageError = () => {
    if (rawMasterUrl && currentSrc !== rawMasterUrl) {
      setCurrentSrc(rawMasterUrl);
    }
  };

  const startDownload = async (e) => {
    e?.stopPropagation();
    if (!user && !isAuthenticated) {
      promptLogin({
        actionName: "download this image",
        message: "Please sign in first to download images",
        duration: 4000,
      });
      return;
    }

    setIsDownloading(true);
    try {
      await handleDownloadImage(imageId, displayTitle);
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const reportImage = async (e) => {
    e?.stopPropagation();
    if (!user && !isAuthenticated) {
      promptLogin({ actionName: "report this image", duration: 4000 });
      return;
    }

    setIsReporting(true);
    try {
      await handleReportImage(imageId);
    } catch (err) {
      console.error("Report error:", err);
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="cursor-pointer group">
        <div className="overflow-hidden border rounded-md p-3 border-gray-200 bg-white shadow-sm hover:shadow-md transition-all">
          <div className="relative rounded-md overflow-hidden shadow-sm">
            {currentSrc && (
              <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isReporting}
                      onClick={reportImage}
                      className="h-8 w-8 rounded-md bg-white/80 backdrop-blur-sm border border-slate-200/80 hover:bg-white shadow-xs cursor-pointer"
                    >
                      {isReporting ? (
                        <Loader2
                          size={16}
                          className="animate-spin text-red-500"
                        />
                      ) : (
                        <MessageSquareWarning
                          size={16}
                          className="text-red-600"
                        />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">Report this image</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isDownloading}
                      onClick={startDownload}
                      className="h-8 w-8 rounded-md bg-white/80 backdrop-blur-sm border border-slate-200/80 hover:bg-white shadow-xs cursor-pointer"
                    >
                      {isDownloading ? (
                        <Loader2
                          size={16}
                          className="animate-spin text-gray-700"
                        />
                      ) : (
                        <Download
                          size={16}
                          className="text-gray-700"
                        />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    Download watermark-free image
                  </TooltipContent>
                </Tooltip>
              </div>
            )}

            {premium && (
              <div className="absolute top-3 left-3 z-30 rounded-md bg-amber-500 text-white px-2 py-0.5 text-[10px] font-bold shadow-xs flex items-center gap-1">
                <Sparkles size={11} />
                <span>PRO</span>
              </div>
            )}

            {currentSrc && (
              <div className="absolute bottom-2.5 right-2.5 rounded-md text-white px-2 py-0.5 text-[11px] font-medium bg-black/60 backdrop-blur-md z-10 flex items-center gap-1.5 border border-white/10 shadow-xs select-none">
                <span className="inline-block size-1.5 rounded-full bg-emerald-400"></span>
                <span>Approved on Zomato &amp; Swiggy</span>
              </div>
            )}

            {currentSrc ? (
              <div className="relative w-full h-48">
                <img
                  src={currentSrc}
                  alt={displayTitle}
                  onError={handleImageError}
                  draggable={false}
                  className="w-full h-full object-cover select-none pointer-events-auto touch-pan-y transition-transform duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                <ImageIcon className="text-gray-400 w-8 h-8" />
              </div>
            )}
          </div>

          {displayTitle && (
            <p
              className="mt-3 text-sm font-medium text-gray-700 truncate"
              title={displayTitle}
            >
              {displayTitle}
            </p>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ImageCard;
