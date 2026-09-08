"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/store/hooks/useSearch";
import { Search, Sparkles, RotateCcw, AlertCircle, UtensilsCrossed } from "lucide-react";

export function EmptyState({ type = "search", heading = "", message = "", query = "", actionText = "", onAction, className = "" }) {
  const { query: activeQuery, resetSearch } = useSearch();
  const currentQuery = query || activeQuery;

  const handleReset = () => {
    if (onAction) {
      onAction();
    } else {
      resetSearch();
    }
  };

  const title =
    heading ||
    (type === "error"
      ? "Unable to load images"
      : currentQuery
        ? `No photos found for "${currentQuery}"`
        : "No food images found");

  const description =
    message ||
    (type === "error"
      ? "There was an issue connecting to the food library. Please try again."
      : currentQuery
        ? "We couldn't find any images matching your exact query. Try another keyword, dish name, or check your spelling."
        : "Try searching for popular dishes like Biryani, Pizza, or Thali to discover photos.");

  return (
    <div
      className={`relative w-full mx-auto my-6 rounded-xl border border-border bg-card p-8 sm:p-12 text-center shadow-xs transition-all duration-200 ${className}`}
    >
      <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
          {type === "error" ? (
            <AlertCircle className="h-8 w-8 text-destructive" />
          ) : (
            <>
              <Search className="h-7 w-7 text-primary" />
              <div className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-xs">
                <UtensilsCrossed className="h-3 w-3" />
              </div>
            </>
          )}
        </div>

        <div className="absolute -bottom-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
          <Sparkles className="h-2.5 w-2.5" />
        </div>
      </div>

      {currentQuery && (
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <span>Query:</span>
          <span className="font-semibold underline underline-offset-2">
            &quot;{currentQuery}&quot;
          </span>
        </div>
      )}

      <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h3>

      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
        {description}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {(actionText || currentQuery) && (
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border-border hover:bg-secondary transition-colors cursor-pointer"
          >
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
            <span>{actionText || "Clear Search"}</span>
          </Button>
        )}
      </div>
    </div>
  );
}

export default EmptyState;
