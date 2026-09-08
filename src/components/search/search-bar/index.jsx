"use client";
import React, { useState, useRef } from "react";
import { useSearch } from "@/store/hooks/useSearch";
import { SearchInput } from "./components/SearchInput";
import { TrendingChips } from "./components/TrendingChips";
import { useSearchShortcut } from "./hooks/useSearchShortcut";
import posthog from "posthog-js";

export function SearchBar({ onSearch = undefined } = {}) {
  const { updateQuery, query: reduxQuery } = useSearch();
  const [localQuery, setLocalQuery] = useState(reduxQuery || "");
  const [prevReduxQuery, setPrevReduxQuery] = useState(reduxQuery);
  const inputRef = useRef(null);

  useSearchShortcut(inputRef);

  if (prevReduxQuery !== reduxQuery) {
    setPrevReduxQuery(reduxQuery);
    setLocalQuery(reduxQuery || "");
  }

  const handleSubmit = (e) => {
    e?.preventDefault();
    const clean = localQuery.trim();
    updateQuery(clean);
    if (clean) {
      posthog.capture("image_search_performed", { source: "search_bar" });
    }
    if (onSearch) onSearch(clean);
  };

  const handleClear = () => {
    setLocalQuery("");
    updateQuery("");
    inputRef.current?.focus();
  };

  const handleTagSelect = (tag) => {
    const nextQuery = localQuery.toLowerCase() === tag.toLowerCase() ? "" : tag;
    setLocalQuery(nextQuery);
    updateQuery(nextQuery);
    if (nextQuery) {
      posthog.capture("image_search_performed", { source: "trending_tag" });
    }
    if (onSearch) onSearch(nextQuery);
  };

  return (
    <div className="w-full space-y-2.5">
      <SearchInput
        inputRef={inputRef}
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        onClear={handleClear}
        onSubmit={handleSubmit}
      />

      <TrendingChips
        activeTag={reduxQuery}
        onSelectTag={handleTagSelect}
      />
    </div>
  );
}

export default SearchBar;
