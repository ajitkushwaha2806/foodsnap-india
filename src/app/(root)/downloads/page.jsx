"use client";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/store/hooks/useUser";
import { Button } from "@/components/ui/button";
import { promptLogin } from "@/lib/auth-helpers";
import { ImageCard } from "@/components/search/image-card";
import { useDownloadedImages } from "@/hooks/useDownloadedImages";
import { ChevronLeft, ChevronRight, ImageIcon, RefreshCcw, LogIn, Sparkles } from "lucide-react";

export default function DownloadsPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: isUserLoading } = useUser();
  const [page, setPage] = useState(1);
  const limit = 12;

  const {
    data,
    isLoading: isDownloadsLoading,
    isFetching,
    refetch,
  } = useDownloadedImages({ page, limit });

  const loading = isUserLoading || isDownloadsLoading || isFetching;
  const downloads = data?.downloads || [];
  const pagination = data?.pagination || {
    totalCount: 0,
    totalPages: 1,
    page: 1,
    limit,
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > (pagination?.totalPages || 1) || loading) {
      return;
    }
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPageButtons = () => {
    const totalPages = pagination?.totalPages || 1;
    const btns = [];

    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      btns.push(
        <Button
          key={i}
          variant={i === page ? "default" : "outline"}
          size="sm"
          className="h-8 px-3 text-xs"
          disabled={loading}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      );
    }

    return btns;
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: limit }).map((_, i) => (
        <div key={i} className="cursor-pointer animate-pulse">
          <div className="overflow-hidden border rounded-md p-3 border-gray-200 bg-white shadow-sm">
            <div className="relative rounded-md overflow-hidden shadow-sm">
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                <ImageIcon className="text-gray-300 w-8 h-8" />
              </div>
            </div>
            <div className="mt-3 h-4 bg-gray-200 rounded-md w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );

  // Unauthenticated state
  if (!isUserLoading && !user && !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
        <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
          <LogIn className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Sign In to View Downloads
        </h2>
        <p className="mt-2 text-sm text-gray-500 max-w-md">
          Please sign in to your account to view and access your downloaded high-resolution food photos.
        </p>
        <Button
          onClick={() =>
            promptLogin({
              actionName: "view your downloads",
              customRedirectPath: "/downloads",
              duration: 4000,
            })
          }
          className="mt-6 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs"
        >
          Sign In Now
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 bg-slate-50/50 min-h-screen"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              Downloads
            </h1>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
              {pagination?.totalCount || 0}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            View and manage all your downloaded high-resolution food images.
          </p>
        </div>

        <Button
          onClick={() => refetch()}
          variant="outline"
          disabled={loading}
          className="flex items-center gap-2 rounded-md border-gray-200 shadow-xs cursor-pointer w-fit"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Refreshing..." : "Refresh"}</span>
        </Button>
      </div>

      <div>
        {loading && downloads.length === 0 ? (
          <LoadingSkeleton />
        ) : downloads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 16v1a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
            </div>

            <h2 className="mt-6 text-xl font-semibold text-gray-800">
              No Downloads Yet
            </h2>

            <p className="mt-2 text-gray-500 text-sm max-w-sm">
              Looks like you haven&apos;t downloaded any images yet. Explore our curated food library and start downloading!
            </p>

            <Button
              onClick={() => router.push("/")}
              className="mt-6 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs"
            >
              Browse Images
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {downloads.map((item) => (
              <ImageCard
                key={item._id}
                title={item.imageId?.title || item.imageId?.name || "Untitled Photo"}
                img={item.imageId?.image_url}
                optimisedImg={item.imageId?.optimised_image_url}
                imageId={item.imageId?._id || item.imageId}
                premium={item.imageId?.premium}
              />
            ))}
          </div>
        )}
      </div>

      {pagination?.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-4 border-t border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500">
            Page {page} of {pagination.totalPages} ({pagination.totalCount} total downloaded)
          </p>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1 || loading}
              onClick={() => handlePageChange(page - 1)}
              className="h-8 flex items-center gap-1 px-2.5 text-xs rounded-md"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Prev</span>
            </Button>

            <div className="flex items-center gap-1">{renderPageButtons()}</div>

            <Button
              variant="outline"
              size="sm"
              disabled={page === pagination.totalPages || loading}
              onClick={() => handlePageChange(page + 1)}
              className="h-8 flex items-center gap-1 px-2.5 text-xs rounded-md"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
