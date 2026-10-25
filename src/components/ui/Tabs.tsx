"use client";

import React, { createContext, useContext, useState, useId, useRef } from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs compound components must be used within a Tabs component");
  }
  return context;
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const baseId = useId();

  const isControlled = controlledValue !== undefined;
  const activeTab = isControlled ? controlledValue : internalValue;

  const setActiveTab = (tab: string) => {
    if (!isControlled) {
      setInternalValue(tab);
    }
    if (onValueChange) {
      onValueChange(tab);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, baseId }}>
      <div className={cn("w-full space-y-4", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function TabsList({ className, children, ...props }: TabsListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const tabs = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])');
    if (!tabs || tabs.length === 0) return;

    const tabsArray = Array.from(tabs);
    const activeIndex = tabsArray.findIndex((tab) => tab === document.activeElement);

    let nextIndex = activeIndex;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      nextIndex = (activeIndex + 1) % tabsArray.length;
      tabsArray[nextIndex]?.focus();
      tabsArray[nextIndex]?.click();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      nextIndex = (activeIndex - 1 + tabsArray.length) % tabsArray.length;
      tabsArray[nextIndex]?.focus();
      tabsArray[nextIndex]?.click();
    } else if (e.key === "Home") {
      e.preventDefault();
      tabsArray[0]?.focus();
      tabsArray[0]?.click();
    } else if (e.key === "End") {
      e.preventDefault();
      tabsArray[tabsArray.length - 1]?.focus();
      tabsArray[tabsArray.length - 1]?.click();
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex items-center gap-1 p-1 bg-[#0a0f1d] border border-slate-800 rounded-xl overflow-x-auto max-w-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TabTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: React.ReactNode;
}

export function TabTrigger({
  value,
  className,
  children,
  disabled,
  ...props
}: TabTriggerProps) {
  const { activeTab, setActiveTab, baseId } = useTabs();
  const isActive = activeTab === value;
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  return (
    <button
      id={tabId}
      role="tab"
      type="button"
      aria-selected={isActive}
      aria-controls={panelId}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      className={cn(
        "px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap select-none",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400",
        isActive
          ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm"
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40",
        disabled && "opacity-40 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export interface TabContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

export function TabContent({ value, className, children, ...props }: TabContentProps) {
  const { activeTab, baseId } = useTabs();
  const isActive = activeTab === value;
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  if (!isActive) return null;

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={tabId}
      tabIndex={0}
      className={cn("focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded-lg", className)}
      {...props}
    >
      {children}
    </div>
  );
}
