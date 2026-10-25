"use client";

import React, { useState } from "react";
import { CheckSquare, Copy, Check, RotateCcw, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ChecklistItem {
  id: string;
  category: "Security" | "OS & Kernel" | "Client & Keys" | "Monitoring & Recovery";
  title: string;
  description: string;
  commandSnippet?: string;
  defaultChecked?: boolean;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: "sec-ssh",
    category: "Security",
    title: "SSH Key-Only Authentication",
    description: "Disable root password login and password authentication in /etc/ssh/sshd_config.",
    commandSnippet: "sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config",
  },
  {
    id: "sec-ufw",
    category: "Security",
    title: "UFW Firewall Port Restriction",
    description: "Keep P2P ports (30303, 9000) open to public; restrict RPC (8545) and Engine API (8551) to 127.0.0.1.",
    commandSnippet: "sudo ufw default deny incoming && sudo ufw allow 22/tcp && sudo ufw allow 30303 && sudo ufw enable",
  },
  {
    id: "sec-user",
    category: "Security",
    title: "Dedicated Unprivileged Service User",
    description: "Never run execution or consensus client daemons as root. Create a dedicated system user without login shell.",
    commandSnippet: "sudo useradd -r -s /usr/sbin/nologin -d /var/lib/ethereum ethereum",
  },
  {
    id: "sec-updates",
    category: "Security",
    title: "Automatic Security Patching",
    description: "Enable unattended-upgrades so critical Linux kernel and OpenSSL CVE patches install automatically.",
    commandSnippet: "sudo apt-get install -y unattended-upgrades && sudo dpkg-reconfigure -plow unattended-upgrades",
  },
  {
    id: "os-ntp",
    category: "OS & Kernel",
    title: "NTP Time Synchronization (Chrony)",
    description: "Proof-of-Stake consensus requires sub-second clock accuracy. Out-of-sync clocks cause missed attestations.",
    commandSnippet: "sudo apt-get install -y chrony && timedatectl status",
  },
  {
    id: "os-nofile",
    category: "OS & Kernel",
    title: "Raise File Descriptor (nofile) Limits",
    description: "Blockchain clients maintain thousands of open TCP socket connections and database LevelDB file locks.",
    commandSnippet: "echo '* soft nofile 65536' | sudo tee -a /etc/security/limits.conf",
  },
  {
    id: "os-noatime",
    category: "OS & Kernel",
    title: "NVMe SSD Mount with 'noatime'",
    description: "Disable access-time file tracking in /etc/fstab to eliminate unnecessary NVMe write cycles.",
    commandSnippet: "sudo nano /etc/fstab # add noatime option to data drive mount",
  },
  {
    id: "os-swap",
    category: "OS & Kernel",
    title: "Configure 8 GB Swapfile Buffer",
    description: "A fast swapfile prevents the Linux kernel OOM-killer from instantly terminating clients during memory spikes.",
    commandSnippet: "sudo fallocate -l 8G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile",
  },
  {
    id: "client-jwt",
    category: "Client & Keys",
    title: "Generate 32-Byte Engine API JWT Secret",
    description: "Execution and consensus clients authenticate over port 8551 via this shared cryptographic token.",
    commandSnippet: "openssl rand -hex 32 | sudo tee /var/lib/ethereum/jwt/jwt.hex && sudo chmod 600 /var/lib/ethereum/jwt/jwt.hex",
  },
  {
    id: "client-checksum",
    category: "Client & Keys",
    title: "Verify GPG Signatures & Binary Checksums",
    description: "Verify sha256 checksums from the client's official release page before running newly downloaded binaries.",
    commandSnippet: "sha256sum -c geth-alltools-linux-amd64-*.tar.gz.asc",
  },
  {
    id: "client-systemd",
    category: "Client & Keys",
    title: "Configure Systemd Daemon Auto-Restart",
    description: "Ensure service files include Restart=always and RestartSec=5s so nodes recover from OS reboots.",
    commandSnippet: "sudo systemctl daemon-reload && sudo systemctl enable --now geth lighthouse",
  },
  {
    id: "mon-metrics",
    category: "Monitoring & Recovery",
    title: "Enable Prometheus / Health Check Metrics",
    description: "Expose client metrics on 127.0.0.1:6060 (Geth) and 127.0.0.1:5054 (Lighthouse) for Grafana alerting.",
    commandSnippet: "--metrics --metrics.addr 127.0.0.1 --metrics.port 6060",
  },
  {
    id: "mon-logs",
    category: "Monitoring & Recovery",
    title: "Configure Journald Log Retention Limits",
    description: "Cap systemd journal size to prevent unrotated node logs from consuming 100% of the root disk volume.",
    commandSnippet: "echo 'SystemMaxUse=2G' | sudo tee -a /etc/systemd/journald.conf && sudo systemctl restart systemd-journald",
  },
  {
    id: "mon-backup",
    category: "Monitoring & Recovery",
    title: "Offline Cold Backup of Validator Mnemonic",
    description: "Record validator seed words on offline metal plates or paper. Never store withdrawal keys on the active server.",
  },
];

export function DeploymentChecklistTool() {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [copied, setCopied] = useState(false);

  const categories = ["All", "Security", "OS & Kernel", "Client & Keys", "Monitoring & Recovery"];

  const filteredItems =
    activeCategory === "All"
      ? CHECKLIST_ITEMS
      : CHECKLIST_ITEMS.filter((item) => item.category === activeCategory);

  const totalCount = CHECKLIST_ITEMS.length;
  const completedCount = Object.values(checkedIds).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const toggleItem = (id: string) => {
    setCheckedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectAll = () => {
    const all: Record<string, boolean> = {};
    CHECKLIST_ITEMS.forEach((it) => {
      all[it.id] = true;
    });
    setCheckedIds(all);
  };

  const handleReset = () => {
    setCheckedIds({});
  };

  const handleCopyMarkdown = () => {
    const lines = [
      "# Node Deployment Pre-Flight Checklist",
      `Completed: ${completedCount}/${totalCount} (${progressPercent}%)`,
      "",
    ];

    CHECKLIST_ITEMS.forEach((item) => {
      const isChecked = Boolean(checkedIds[item.id]);
      lines.push(`- [${isChecked ? "x" : " "}] **${item.title}** (${item.category})`);
      lines.push(`  ${item.description}`);
      if (item.commandSnippet) {
        lines.push(`  \`${item.commandSnippet}\``);
      }
    });

    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Tool Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-cyan-400" />
          <span>Production Node Deployment Pre-Flight Checklist</span>
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          An interactive operational checklist covering server hardening, Linux kernel tuning, JWT cryptography, and observability before putting economic stake onto mainnet.
        </p>
      </div>

      {/* Progress & Controls Card */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-[#070b16] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Readiness Progress</span>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono mt-0.5">
              {completedCount} of {totalCount} Tasks Verified ({progressPercent}%)
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button size="sm" variant="ghost" leftIcon={<Sparkles className="w-3.5 h-3.5" />} onClick={handleSelectAll}>
              Mark All Done
            </Button>
            <Button size="sm" variant="outline" leftIcon={<RotateCcw className="w-3.5 h-3.5" />} onClick={handleReset}>
              Reset
            </Button>
            <Button
              size="sm"
              variant="primary"
              leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              onClick={handleCopyMarkdown}
            >
              {copied ? "Copied Markdown!" : "Copy as Markdown"}
            </Button>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              progressPercent === 100 ? "bg-emerald-400" : progressPercent >= 50 ? "bg-cyan-400" : "bg-blue-400"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-semibold"
                    : "bg-[#0b101d] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Checklist Items Container */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isDone = Boolean(checkedIds[item.id]);

          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                isDone
                  ? "bg-[#08121d] border-cyan-500/40 text-slate-200"
                  : "bg-[#070b16] border-slate-800 hover:border-slate-700 text-slate-300"
              }`}
            >
              {/* Checkbox box */}
              <input
                type="checkbox"
                checked={isDone}
                onChange={() => {}} // handled by parent onClick
                className="w-5 h-5 rounded-lg mt-0.5 accent-cyan-400 cursor-pointer shrink-0"
              />

              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className={`text-sm sm:text-base font-bold ${isDone ? "text-cyan-300" : "text-white"}`}>
                    {item.title}
                  </h4>
                  <Badge
                    variant={
                      item.category === "Security"
                        ? "error"
                        : item.category === "OS & Kernel"
                        ? "cyan"
                        : item.category === "Client & Keys"
                        ? "purple"
                        : "info"
                    }
                    size="sm"
                  >
                    {item.category}
                  </Badge>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {item.commandSnippet && (
                  <div
                    onClick={(e) => e.stopPropagation()} // Prevent toggling when highlighting snippet
                    className="p-2.5 rounded-lg bg-[#0b101d] border border-slate-800 text-cyan-300 font-mono text-xs overflow-x-auto select-all"
                  >
                    <code>{item.commandSnippet}</code>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
