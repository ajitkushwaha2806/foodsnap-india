"use client";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useSearch } from "@/store/hooks/useSearch";
import { Skeleton } from "@/components/ui/skeleton";
import SearchBar from "@/components/search/search-bar";
import ImageCard from "@/components/search/image-card";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import EmptyState from "@/components/global/EmptyState";
import ServiceBannerCarousel from "@/components/home/ServiceBannerCarousel";

export default function Home() {
  const { query, searchTrigger } = useSearch();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error: queryError, refetch } = useSearchQuery(query, 12, searchTrigger);

  const loaderRef = useRef(null);

  const results = data?.pages?.flatMap((page) => page.results) || [];
  const totalCount = data?.pages?.[0]?.pagination?.total ?? results.length;
  const showEmpty = !isLoading && !isError && results.length === 0;
  const showResults = !isError && results.length > 0;

  useEffect(() => {
    const node = loaderRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="space-y-4">
        <SearchBar />

        {!query && <ServiceBannerCarousel />}

        {showResults && (
          <div className="flex items-center justify-between pt-2 text-xs sm:text-sm text-muted-foreground border-b border-border pb-3">
            <div>
              {query ? (
                <span>
                  Found <strong className="text-foreground font-semibold">{totalCount}</strong> results for &ldquo;<span className="text-primary font-medium">{query}</span>&rdquo;
                </span>
              ) : (
                <span>
                  Showing <strong className="text-foreground font-semibold">{results.length}</strong> featured photos
                </span>
              )}
            </div>
            <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Ready to use
            </div>
          </div>
        )}
      </div>

      {isLoading && results.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border p-3 space-y-3 bg-card"
            >
              <Skeleton className="aspect-4/3 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4 rounded" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="flex justify-center items-center w-full my-6">
          <EmptyState
            type="error"
            heading="Search Unavailable"
            message={queryError?.message || "Something went wrong while connecting to the image search API."}
            actionText="Try Again"
            onAction={() => refetch()}
          />
        </div>
      )}

      {showEmpty && (
        <div className="flex justify-center w-full my-6">
          <EmptyState
            type="search"
            query={query}
          />
        </div>
      )}

      {showResults && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {results.map((item) => (
            <ImageCard
              key={item._id}
              title={item.title || item.name}
              img={item.image_url}
              optimisedImg={item.optimised_image_url}
              imageId={item._id}
              premium={item.premium}
            />
          ))}
        </div>
      )}

      {hasNextPage && (
        <div ref={loaderRef} className="flex justify-center py-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="animate-spin size-5 text-primary" />
            <span>Loading more delicious food photos...</span>
          </div>
        </div>
      )}
    </div>
  );
}
