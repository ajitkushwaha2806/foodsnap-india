"use client";
import React from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEARCH_PLACEHOLDER } from "../constants";

export function SearchInput({ inputRef, value, onChange, onClear, onSubmit }) {
  return (
    <form
      onSubmit={onSubmit}
      className="group relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1.5 shadow-xs transition-all duration-200 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 hover:border-slate-300 dark:hover:border-slate-700"
    >
      <div className="flex items-center justify-center pl-3 pr-2 text-slate-400 group-focus-within:text-primary transition-colors">
        <Search className="size-5" />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={SEARCH_PLACEHOLDER}
        className="w-full bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none py-2 px-1"
      />

      {value && (
        <button
          type="button"
          onClick={onClear}
          className="flex items-center justify-center size-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mr-1 cursor-pointer"
          title="Clear search"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      )}

      {!value && (
        <div className="hidden sm:flex items-center mr-2 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] font-semibold text-muted-foreground select-none">
          ⌘K
        </div>
      )}

      <Button
        type="submit"
        size="sm"
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 h-9 rounded-md shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
      >
        Search
      </Button>
    </form>
  );
}

export default SearchInput;
