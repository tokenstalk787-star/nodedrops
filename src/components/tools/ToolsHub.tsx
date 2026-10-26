"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Cpu, HardDrive, Network, DollarSign, CheckSquare } from "lucide-react";
import { HardwareChecklistTool } from "./HardwareChecklistTool";
import { StorageCalculatorTool } from "./StorageCalculatorTool";
import { BandwidthCalculatorTool } from "./BandwidthCalculatorTool";
import { OperatingCostCalculatorTool } from "./OperatingCostCalculatorTool";
import { DeploymentChecklistTool } from "./DeploymentChecklistTool";
import { cn } from "@/lib/utils";

export type ToolTab = "hardware" | "storage" | "bandwidth" | "cost" | "deployment";

interface ToolsHubProps {
  initialTab?: ToolTab;
}

function ToolsHubInternal({ initialTab = "hardware" }: ToolsHubProps) {
  const router = useRouter();
  const pathname = usePathname() || "/tools";
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<ToolTab>(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get("tab") as ToolTab | null;
    if (tabParam && ["hardware", "storage", "bandwidth", "cost", "deployment"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab: ToolTab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`${pathname}?${params.toString()}`);
  };

  const tabs: { id: ToolTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: "hardware",
      label: "Hardware Checklist",
      icon: <Cpu className="w-4 h-4" />,
    },
    {
      id: "storage",
      label: "Storage Estimator",
      icon: <HardDrive className="w-4 h-4" />,
    },
    {
      id: "bandwidth",
      label: "Bandwidth Planning",
      icon: <Network className="w-4 h-4" />,
    },
    {
      id: "cost",
      label: "Operating Cost (TCO)",
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      id: "deployment",
      label: "Pre-Flight Checklist",
      icon: <CheckSquare className="w-4 h-4" />,
      badge: "Interactive",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap",
                isActive
                  ? "bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 font-semibold shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent"
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Render Active Tool */}
      <div className="pt-2">
        {activeTab === "hardware" && <HardwareChecklistTool />}
        {activeTab === "storage" && <StorageCalculatorTool />}
        {activeTab === "bandwidth" && <BandwidthCalculatorTool />}
        {activeTab === "cost" && <OperatingCostCalculatorTool />}
        {activeTab === "deployment" && <DeploymentChecklistTool />}
      </div>
    </div>
  );
}

export function ToolsHub(props: ToolsHubProps) {
  return (
    <Suspense
      fallback={<div className="h-96 w-full rounded-2xl bg-[#070b16] border border-slate-800 animate-pulse" />}
    >
      <ToolsHubInternal {...props} />
    </Suspense>
  );
}
