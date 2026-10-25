"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (term: string) => void;
  showShortcut?: boolean;
  clearable?: boolean;
}

export function SearchBar({
  onSearch,
  showShortcut = true,
  clearable = true,
  placeholder = "Search networks, guides, testnets...",
  className,
  value: controlledValue,
  onChange,
  ...props
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? String(controlledValue) : internalValue;

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    if (onChange) onChange(e);
    if (onSearch) onSearch(e.target.value);
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue("");
    }
    if (onSearch) onSearch("");
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(currentValue);
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn("relative flex items-center w-full group", className)}
    >
      <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
        <Search className="w-4 h-4" aria-hidden="true" />
      </div>
      <input
        ref={inputRef}
        type="search"
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Search NodeDrops"
        className={cn(
          "w-full rounded-xl bg-[#0e1424] text-slate-100 text-sm border border-slate-700/80 pl-10 pr-16 py-2.5 transition-all placeholder:text-slate-500",
          "focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 focus:bg-[#11182c]",
          "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
        )}
        {...props}
      />
      <div className="absolute right-3 flex items-center gap-1.5">
        {clearable && currentValue.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-slate-400 hover:text-slate-200 rounded focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
            aria-label="Clear search input"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        {showShortcut && currentValue.length === 0 && (
          <kbd
            className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800/80 rounded border border-slate-700/80 select-none pointer-events-none"
            aria-hidden="true"
          >
            <span className="text-[11px]">⌘</span>K
          </kbd>
        )}
      </div>
    </form>
  );
}
