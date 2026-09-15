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
        message: "Please sign up first to download images",
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
      <div className="cursor-pointer group max-w-[350px] mx-auto w-full">
        <div className="overflow-hidden border rounded-xl p-3 border-slate-200/80 bg-white dark:bg-card shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 hover:-translate-y-0.5">
          <div className="relative rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900 shadow-2xs aspect-4/3 @container">
            {currentSrc && (
              <div className="absolute top-2.5 right-2.5 z-30 flex items-center gap-1.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isReporting}
                      onClick={reportImage}
                      className="h-8 w-8 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 shadow-xs cursor-pointer transition-transform active:scale-95"
                    >
                      {isReporting ? (
                        <Loader2
                          size={15}
                          className="animate-spin text-red-500"
                        />
                      ) : (
                        <MessageSquareWarning
                          size={15}
                          className="text-red-600 dark:text-red-500"
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
                      className="h-8 w-8 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 shadow-xs cursor-pointer transition-transform active:scale-95"
                    >
                      {isDownloading ? (
                        <Loader2
                          size={15}
                          className="animate-spin text-primary"
                        />
                      ) : (
                        <Download
                          size={15}
                          className="text-slate-700 dark:text-slate-200"
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

            <div className="absolute top-[2.5cqw] left-[2.5cqw] z-30 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white px-[2.5cqw] py-[0.5cqw] text-[clamp(10px,2.5cqw,18px)] font-bold shadow-xs flex items-center gap-[1cqw]">
              <Sparkles className="w-[clamp(11px,2.8cqw,20px)] h-[clamp(11px,2.8cqw,20px)]" />
              <span>PREMIUM</span>
            </div>

            {currentSrc && (
              <div className="absolute bottom-[2.5cqw] left-[2.5cqw] z-20 flex items-center gap-[1.5cqw] px-[4cqw] py-[3cqw] rounded-md bg-slate-950/75 backdrop-blur-md border border-white/20 text-white text-[clamp(11px,2.8cqw,20px)] font-medium shadow-md select-none pointer-events-none">
                <span className="relative flex h-[2cqw] w-[1.5cqw] min-h-[6px] min-w-[6px] shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-full w-full bg-emerald-400"></span>
                </span>
                <span className="tracking-tight leading-none text-white/95">
                  Approved on Zomato &amp; Swiggy
                </span>
              </div>
            )}



            {currentSrc ? (
              <img
                src={currentSrc}
                alt={displayTitle}
                onError={handleImageError}
                draggable={false}
                className="w-full h-full object-cover object-center select-none pointer-events-auto touch-pan-y transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <ImageIcon className="text-slate-400 w-8 h-8" />
              </div>
            )}
          </div>

          {displayTitle && (
            <h3
              className="mt-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-primary transition-colors tracking-tight px-0.5"
              title={displayTitle}
            >
              {displayTitle}
            </h3>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ImageCard;
