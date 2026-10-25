"use client";

import React, { useState } from "react";
import { DollarSign, Home, Cloud, Scale, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FormulaCard } from "./FormulaCard";
import { DisclaimerNotice } from "./DisclaimerNotice";

export function OperatingCostCalculatorTool() {
  // Home Lab Inputs
  const [hardwareUpfront, setHardwareUpfront] = useState<string>("1600");
  const [powerWatts, setPowerWatts] = useState<string>("110");
  const [kwhCost, setKwhCost] = useState<string>("0.16");
  const [homeIspCost, setHomeIspCost] = useState<string>("15");

  // Cloud Inputs
  const [cloudCompute, setCloudCompute] = useState<string>("90");
  const [cloudStorage, setCloudStorage] = useState<string>("35");
  const [cloudEgress, setCloudEgress] = useState<string>("15");

  // Validation
  const hwNum = parseFloat(hardwareUpfront);
  const wattsNum = parseFloat(powerWatts);
  const kwhNum = parseFloat(kwhCost);
  const ispNum = parseFloat(homeIspCost);

  const computeNum = parseFloat(cloudCompute);
  const storageNum = parseFloat(cloudStorage);
  const egressNum = parseFloat(cloudEgress);

  const errors: Record<string, string> = {};
  if (isNaN(hwNum) || hwNum < 0) errors.hw = "Hardware cost must be a positive number ($).";
  if (isNaN(wattsNum) || wattsNum < 0) errors.watts = "System wattage must be 0 or positive (W).";
  if (isNaN(kwhNum) || kwhNum < 0) errors.kwh = "Electricity rate must be a positive number ($/kWh).";
  if (isNaN(ispNum) || ispNum < 0) errors.isp = "Internet cost must be 0 or positive ($/month).";

  if (isNaN(computeNum) || computeNum < 0) errors.compute = "Compute cost must be 0 or positive ($/month).";
  if (isNaN(storageNum) || storageNum < 0) errors.storage = "Storage cost must be 0 or positive ($/month).";
  if (isNaN(egressNum) || egressNum < 0) errors.egress = "Egress cost must be 0 or positive ($/month).";

  // Calculations
  // Monthly Electricity: (Watts * 730 hours / 1000) * $/kWh
  const monthlyElectricity = !errors.watts && !errors.kwh ? ((wattsNum * 730) / 1000) * kwhNum : 0;
  // Amortized hardware over 36 months (3 years)
  const monthlyHardwareAmortized = !errors.hw ? hwNum / 36 : 0;
  const homeMonthlyTotal = monthlyHardwareAmortized + monthlyElectricity + (isNaN(ispNum) ? 0 : ispNum);
  const homeAnnualTotal = homeMonthlyTotal * 12;
  const home3YearTco = hwNum + (monthlyElectricity + (isNaN(ispNum) ? 0 : ispNum)) * 36;

  const cloudMonthlyTotal = (isNaN(computeNum) ? 0 : computeNum) + (isNaN(storageNum) ? 0 : storageNum) + (isNaN(egressNum) ? 0 : egressNum);
  const cloudAnnualTotal = cloudMonthlyTotal * 12;
  const cloud3YearTco = cloudMonthlyTotal * 36;

  const savings3Year = cloud3YearTco - home3YearTco;
  const monthlyBreakEvenDiff = cloudMonthlyTotal - (monthlyElectricity + (isNaN(ispNum) ? 0 : ispNum));
  const breakEvenMonths = monthlyBreakEvenDiff > 0 ? Math.ceil(hwNum / monthlyBreakEvenDiff) : null;

  const handleApplyPreset = (tier: "mini-pc" | "mid-tower" | "enterprise") => {
    if (tier === "mini-pc") {
      setHardwareUpfront("950");
      setPowerWatts("65");
      setKwhCost("0.16");
      setHomeIspCost("10");
      setCloudCompute("65");
      setCloudStorage("25");
      setCloudEgress("10");
    } else if (tier === "mid-tower") {
      setHardwareUpfront("1600");
      setPowerWatts("110");
      setKwhCost("0.16");
      setHomeIspCost("15");
      setCloudCompute("90");
      setCloudStorage("35");
      setCloudEgress("15");
    } else if (tier === "enterprise") {
      setHardwareUpfront("3200");
      setPowerWatts("250");
      setKwhCost("0.18");
      setHomeIspCost("30");
      setCloudCompute("220");
      setCloudStorage("80");
      setCloudEgress("40");
    }
  };

  return (
    <div className="space-y-8">
      {/* Tool Introduction */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-cyan-400" />
          <span>Node Operating Cost &amp; TCO Estimator</span>
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          Compare total cost of ownership (TCO) between running self-hosted bare metal at home vs renting monthly cloud virtual private servers (VPS).
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-slate-400 font-mono flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Sizing Archetypes:
        </span>
        <Button size="sm" variant="ghost" onClick={() => handleApplyPreset("mini-pc")}>
          NUC / Mini PC (Low Power, 65W)
        </Button>
        <Button size="sm" variant="ghost" onClick={() => handleApplyPreset("mid-tower")}>
          Custom Mid-Tower (32GB RAM, 110W)
        </Button>
        <Button size="sm" variant="ghost" onClick={() => handleApplyPreset("enterprise")}>
          Enterprise Server / High-IOPS (250W)
        </Button>
      </div>

      {/* Inputs Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Self-Hosted Home Lab */}
        <div className="p-5 rounded-2xl border border-cyan-500/20 bg-[#070b16] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
              <Home className="w-4 h-4 text-cyan-400" />
              <span>Self-Hosted / Home Lab</span>
            </h3>
            <Badge variant="cyan" size="sm">CapEx Model</Badge>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <label className="text-slate-200 font-semibold">Hardware Upfront Cost ($)</label>
                <span className="text-slate-400 font-mono">Amortized over 36 mo</span>
              </div>
              <input
                type="number"
                min="0"
                value={hardwareUpfront}
                onChange={(e) => setHardwareUpfront(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
              />
              {errors.hw && <p className="text-xs text-rose-400">{errors.hw}</p>}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <label className="text-slate-200 font-semibold">Average Power Draw (Watts)</label>
                <span className="text-slate-400 font-mono">Unit: Watts (W)</span>
              </div>
              <input
                type="number"
                min="0"
                value={powerWatts}
                onChange={(e) => setPowerWatts(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
              />
              {errors.watts && <p className="text-xs text-rose-400">{errors.watts}</p>}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <label className="text-slate-200 font-semibold">Electricity Rate ($/kWh)</label>
                <span className="text-slate-400 font-mono">US Avg: $0.16 / EU: $0.28</span>
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                value={kwhCost}
                onChange={(e) => setKwhCost(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
              />
              {errors.kwh && <p className="text-xs text-rose-400">{errors.kwh}</p>}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <label className="text-slate-200 font-semibold">Dedicated Broadband / Static IP Add-on ($/mo)</label>
                <span className="text-slate-400 font-mono">Unit: $/month</span>
              </div>
              <input
                type="number"
                min="0"
                value={homeIspCost}
                onChange={(e) => setHomeIspCost(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
              />
              {errors.isp && <p className="text-xs text-rose-400">{errors.isp}</p>}
            </div>
          </div>
        </div>

        {/* Right: Cloud VPS / Dedicated Server */}
        <div className="p-5 rounded-2xl border border-blue-500/20 bg-[#070b16] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
              <Cloud className="w-4 h-4 text-blue-400" />
              <span>Cloud Server / Dedicated VPS</span>
            </h3>
            <Badge variant="info" size="sm">OpEx Model</Badge>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <label className="text-slate-200 font-semibold">Monthly Server Instance Subscription ($/mo)</label>
                <span className="text-slate-400 font-mono">Hetzner / AWS / OVH</span>
              </div>
              <input
                type="number"
                min="0"
                value={cloudCompute}
                onChange={(e) => setCloudCompute(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
              />
              {errors.compute && <p className="text-xs text-rose-400">{errors.compute}</p>}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <label className="text-slate-200 font-semibold">Attached NVMe Volume / Extra Storage ($/mo)</label>
                <span className="text-slate-400 font-mono">Unit: $/month</span>
              </div>
              <input
                type="number"
                min="0"
                value={cloudStorage}
                onChange={(e) => setCloudStorage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
              />
              {errors.storage && <p className="text-xs text-rose-400">{errors.storage}</p>}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <label className="text-slate-200 font-semibold">Data Egress / Bandwidth Overages ($/mo)</label>
                <span className="text-slate-400 font-mono">Unit: $/month</span>
              </div>
              <input
                type="number"
                min="0"
                value={cloudEgress}
                onChange={(e) => setCloudEgress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
              />
              {errors.egress && <p className="text-xs text-rose-400">{errors.egress}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Results Card */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#070b16] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Financial Comparison</span>
            <h4 className="text-xl font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-cyan-400" />
              <span>3-Year Total Cost of Ownership (TCO)</span>
            </h4>
          </div>

          {savings3Year > 0 ? (
            <Badge variant="success" size="md">
              Home Lab Saves ${savings3Year.toFixed(0)} over 3 Years
            </Badge>
          ) : (
            <Badge variant="info" size="md">
              Cloud is ${Math.abs(savings3Year).toFixed(0)} Cheaper over 3 Years
            </Badge>
          )}
        </div>

        {/* Comparison Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Home Lab Column */}
          <div className="p-4 rounded-xl bg-[#0b101d] border border-cyan-500/30 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-white flex items-center gap-1.5 font-mono">
                <Home className="w-4 h-4 text-cyan-400" /> Home Lab
              </span>
              <span className="text-xs font-mono text-cyan-300">
                Electricity: ${monthlyElectricity.toFixed(2)}/mo
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2.5 rounded-lg bg-[#070b16] border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Monthly TCO</span>
                <span className="text-base sm:text-lg font-bold text-white">${homeMonthlyTotal.toFixed(1)}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#070b16] border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Annual Cost</span>
                <span className="text-base sm:text-lg font-bold text-white">${homeAnnualTotal.toFixed(0)}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#070b16] border border-slate-800">
                <span className="text-[10px] text-slate-400 block">3-Year TCO</span>
                <span className="text-base sm:text-lg font-bold text-cyan-400">${home3YearTco.toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* Cloud Column */}
          <div className="p-4 rounded-xl bg-[#0b101d] border border-blue-500/30 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-white flex items-center gap-1.5 font-mono">
                <Cloud className="w-4 h-4 text-blue-400" /> Cloud VPS
              </span>
              <span className="text-xs font-mono text-blue-300">
                Zero Upfront Hardware
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2.5 rounded-lg bg-[#070b16] border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Monthly TCO</span>
                <span className="text-base sm:text-lg font-bold text-white">${cloudMonthlyTotal.toFixed(1)}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#070b16] border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Annual Cost</span>
                <span className="text-base sm:text-lg font-bold text-white">${cloudAnnualTotal.toFixed(0)}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#070b16] border border-slate-800">
                <span className="text-[10px] text-slate-400 block">3-Year TCO</span>
                <span className="text-base sm:text-lg font-bold text-blue-400">${cloud3YearTco.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Break-Even Insight */}
        {breakEvenMonths && (
          <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200">
            <strong className="text-cyan-300 font-semibold">Break-Even Analysis: </strong>
            At these cost rates, self-hosting breaks even after approximately <strong>{breakEvenMonths} months</strong> of continuous operation. Beyond that point, home hosting is substantially more economical than renting cloud resources.
          </div>
        )}
      </div>

      <DisclaimerNotice toolName="Cost Estimator" />

      {/* Formula & Calculation Logic */}
      <FormulaCard
        formula="Monthly Electricity = (Watts × 730 / 1000) × $/kWh
Home Monthly TCO = (Hardware_Upfront / 36) + Monthly Electricity + ISP_Cost
Cloud Monthly TCO = Compute_Cost + Storage_Cost + Egress_Cost
3-Year TCO = Monthly TCO × 36"
        variables={[
          { name: "Watts", description: "Average continuous electrical consumption under validator workload", unit: "Watts (W)" },
          { name: "$/kWh", description: "Local residential or colocation commercial electricity tariff", unit: "$/kWh" },
          { name: "730", description: "Standard average hours per operational month (365 × 24 / 12)", unit: "Hours" },
          { name: "36", description: "3-year standard equipment depreciation horizon", unit: "Months" },
        ]}
        assumptions={[
          "Assumes constant uninterrupted 24/7/365 electrical power draw without sleep or power throttling states.",
          "Cloud provider pricing does not include ephemeral spot discounts or sudden bandwidth egress spikes.",
        ]}
      />
    </div>
  );
}
