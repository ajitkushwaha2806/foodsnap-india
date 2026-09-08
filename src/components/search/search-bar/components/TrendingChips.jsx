"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";
import { TRENDING_TAGS } from "../constants";

export function TrendingChips({ activeTag, onSelectTag }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-1 text-xs">
      <div className="flex items-center gap-1 text-muted-foreground font-semibold shrink-0 pr-1 text-[11px] uppercase tracking-wider">
        <Flame className="size-3.5 text-amber-500 fill-amber-500/20" />
        <span>Trending:</span>
      </div>

      {TRENDING_TAGS.map((tag) => {
        const isSelected = activeTag?.toLowerCase() === tag.toLowerCase();

        return (
          <button
            key={tag}
            type="button"
            onClick={() => onSelectTag(tag)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all duration-150 cursor-pointer border",
              isSelected
                ? "bg-primary text-primary-foreground border-primary shadow-xs font-semibold scale-105"
                : "bg-white border-slate-200 text-muted-foreground hover:text-foreground hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}

export default TrendingChips;
