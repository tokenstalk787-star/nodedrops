"use client";

import React, { useState } from "react";
import {
  Server,
  Cpu,
  Layers,
  Sparkles,
  Terminal,
  Activity,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SearchBar } from "@/components/ui/SearchBar";
import { Pagination } from "@/components/ui/Pagination";
import { Tabs, TabsList, TabTrigger, TabContent } from "@/components/ui/Tabs";
import { Alert } from "@/components/ui/Alert";
import { Skeleton, CardSkeleton, TableRowSkeleton } from "@/components/ui/SkeletonLoader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { CopyButton } from "@/components/ui/CopyButton";
import { Modal } from "@/components/ui/Modal";

export default function DesignSystemPage() {
  const [currentPage, setCurrentPage] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("ethereum");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="space-y-3 pb-6 border-b border-slate-800">
        <Breadcrumbs items={[{ label: "Design System", href: "/design-system" }]} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              NodeDrops Design System
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Visual foundation, reusable primitives, and accessible Web3 infrastructure components.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="cyan" size="md" withDot withPing>
              Phase 02 Living Spec
            </Badge>
          </div>
        </div>
      </div>

      {/* Component Section 1: Logo & Brand Marks */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span>1. Brand & Logo Primitives</span>
        </h2>
        <Card className="p-6">
          <div className="flex flex-wrap items-center gap-8">
            <div className="space-y-2">
              <span className="text-xs text-slate-400 block font-mono">Small (sm)</span>
              <Logo size="sm" asLink={false} />
            </div>
            <div className="space-y-2">
              <span className="text-xs text-slate-400 block font-mono">Medium (md - Default)</span>
              <Logo size="md" asLink={false} />
            </div>
            <div className="space-y-2">
              <span className="text-xs text-slate-400 block font-mono">Large (lg)</span>
              <Logo size="lg" asLink={false} />
            </div>
          </div>
        </Card>
      </section>

      {/* Component Section 2: Buttons & Actions */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <span>2. Buttons & Actions</span>
        </h2>
        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Variants
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary Action</Button>
              <Button variant="secondary">Secondary Action</Button>
              <Button variant="outline">Outline Action</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="danger">Danger Action</Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Sizes & Icons
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm" leftIcon={<Server className="w-3.5 h-3.5" />}>
                Small (sm)
              </Button>
              <Button size="md" leftIcon={<Cpu className="w-4 h-4" />}>
                Medium (md)
              </Button>
              <Button size="lg" rightIcon={<Layers className="w-4 h-4" />}>
                Large (lg)
              </Button>
              <Button variant="primary" isLoading>
                Deploying Node...
              </Button>
              <Button variant="secondary" disabled>
                Disabled State
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Component Section 3: Badges & Status Indicators */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <span>3. Badges & Node Status Indicators</span>
        </h2>
        <Card className="p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="success" withDot withPing>
              Synced & Healthy
            </Badge>
            <Badge variant="warning" withDot>
              Catching Up (85%)
            </Badge>
            <Badge variant="error" withDot>
              Peers Dropped
            </Badge>
            <Badge variant="info">Upcoming Fork</Badge>
            <Badge variant="neutral">Pruned Archive</Badge>
            <Badge variant="purple" withDot>
              Active Validator
            </Badge>
            <Badge variant="cyan" withDot>
              Testnet Live
            </Badge>
          </div>
        </Card>
      </section>

      {/* Component Section 4: Form Controls & Inputs */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">4. Inputs, Selects & Copy Button</h2>
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="RPC Endpoint URL"
              placeholder="https://eth-mainnet.g.alchemy.com/v2/..."
              helperText="Must be an HTTP or WebSocket RPC URL."
            />
            <Select
              label="Target Blockchain Network"
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(e.target.value)}
              options={[
                { value: "ethereum", label: "Ethereum (Mainnet & Holesky)" },
                { value: "arbitrum", label: "Arbitrum One (Rollup)" },
                { value: "optimism", label: "OP Mainnet (OP Stack)" },
                { value: "base", label: "Base (Layer 2)" },
                { value: "solana", label: "Solana (Mainnet-Beta)" },
              ]}
            />
            <Input
              label="Node Sync Port"
              placeholder="8545"
              error="Port 8545 is already in use by another local process."
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                CLI Docker Run Command
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#07090f] border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto justify-between">
                <span className="truncate mr-2">docker run -d --name geth-node -p 8545:8545 ethereum/client-go:stable</span>
                <CopyButton value="docker run -d --name geth-node -p 8545:8545 ethereum/client-go:stable" />
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Component Section 5: SearchBar & Breadcrumbs */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">5. Search Bar & Breadcrumbs</h2>
        <Card className="p-6 space-y-4">
          <SearchBar
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Quick search nodes, RPCs, and validator guides..."
          />
          <Breadcrumbs
            items={[
              { label: "Networks", href: "/networks" },
              { label: "Ethereum", href: "/networks/ethereum" },
              { label: "Geth Full Node Setup" },
            ]}
          />
        </Card>
      </section>

      {/* Component Section 6: Cards & Glow Variants */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">6. Cards & Glow Hover Variants</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverable glow="cyan">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="cyan" size="sm">EVM Layer 1</Badge>
                <span className="text-xs font-mono text-slate-400">16 GB RAM</span>
              </div>
              <CardTitle className="mt-2">Ethereum Full Node</CardTitle>
              <CardDescription>Execution + Consensus client pairing with Geth and Lighthouse.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-slate-300 space-y-1 font-mono">
                <div>Disk: 2 TB NVMe SSD</div>
                <div>Network: 100 Mbps Up/Down</div>
              </div>
            </CardContent>
            <CardFooter>
              <span className="text-xs text-cyan-400 font-medium">View Runbook →</span>
            </CardFooter>
          </Card>

          <Card hoverable glow="blue">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="info" size="sm">Optimistic Rollup</Badge>
                <span className="text-xs font-mono text-slate-400">32 GB RAM</span>
              </div>
              <CardTitle className="mt-2">Arbitrum Nitro Node</CardTitle>
              <CardDescription>WASM-powered state execution engine with L1 gas validation.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-slate-300 space-y-1 font-mono">
                <div>Disk: 3 TB NVMe SSD</div>
                <div>L1 Sync: Required</div>
              </div>
            </CardContent>
            <CardFooter>
              <span className="text-xs text-cyan-400 font-medium">View Runbook →</span>
            </CardFooter>
          </Card>

          <Card hoverable glow="violet">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="purple" size="sm">PoH Consensus</Badge>
                <span className="text-xs font-mono text-slate-400">128 GB RAM</span>
              </div>
              <CardTitle className="mt-2">Solana Validator</CardTitle>
              <CardDescription>High throughput validator node with proof-of-history turbine.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-slate-300 space-y-1 font-mono">
                <div>Disk: 2x 1 TB NVMe RAID</div>
                <div>Network: 1 Gbps Symmetric</div>
              </div>
            </CardContent>
            <CardFooter>
              <span className="text-xs text-cyan-400 font-medium">View Runbook →</span>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Component Section 7: Tabs & ARIA Panels */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">7. Accessible ARIA Tabs</h2>
        <Card className="p-6">
          <Tabs defaultValue="docker">
            <TabsList>
              <TabTrigger value="docker">Docker Compose</TabTrigger>
              <TabTrigger value="binary">Native Binary</TabTrigger>
              <TabTrigger value="systemd">Systemd Service</TabTrigger>
            </TabsList>
            <TabContent value="docker" className="p-4 rounded-xl bg-[#07090f] border border-slate-800 mt-3 font-mono text-xs text-slate-300">
              <code>services:<br />&nbsp;&nbsp;geth:<br />&nbsp;&nbsp;&nbsp;&nbsp;image: ethereum/client-go:stable<br />&nbsp;&nbsp;&nbsp;&nbsp;command: --mainnet --http --http.addr 0.0.0.0</code>
            </TabContent>
            <TabContent value="binary" className="p-4 rounded-xl bg-[#07090f] border border-slate-800 mt-3 font-mono text-xs text-slate-300">
              <code>wget https://gethstore.blob.core.windows.net/builds/geth-linux-amd64-latest.tar.gz<br />tar -xvf geth-linux-amd64-latest.tar.gz</code>
            </TabContent>
            <TabContent value="systemd" className="p-4 rounded-xl bg-[#07090f] border border-slate-800 mt-3 font-mono text-xs text-slate-300">
              <code>[Unit]<br />Description=Ethereum Execution Client (Geth)<br />After=network.target</code>
            </TabContent>
          </Tabs>
        </Card>
      </section>

      {/* Component Section 8: Alerts & Feedback */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">8. Alerts & Notices</h2>
        <div className="space-y-3">
          <Alert variant="info" title="Scheduled Hard Fork Notice" dismissible>
            Network upgrade scheduled at block #21,450,000. Ensure your node client is updated to v1.14.0 or above.
          </Alert>
          <Alert variant="success" title="Node Verified Successfully">
            Your RPC endpoint responded to eth_blockNumber in 42ms with zero error rate.
          </Alert>
          <Alert variant="warning" title="Disk Utilization Warning">
            Node partition /var/lib/geth has reached 88% capacity. Consider pruning ancient receipts.
          </Alert>
          <Alert variant="error" title="Peer Discovery Failure">
            Unable to connect to bootnodes. Verify outbound UDP port 30303 is open in your firewall.
          </Alert>
        </div>
      </section>

      {/* Component Section 9: Skeleton Loaders */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">9. Skeleton Loaders (Motion Reduced Safe)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <span className="text-xs text-slate-400 font-mono">Primitives (Text, Circle, Bar)</span>
            <div className="rounded-xl bg-[#0e1424] border border-slate-800 p-5 space-y-3">
              <Skeleton variant="text" width="80%" height={16} />
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="text" width="60%" height={14} />
              </div>
              <Skeleton variant="rectangular" height={32} />
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-xs text-slate-400 font-mono">Card Skeleton</span>
            <CardSkeleton />
          </div>
          <div className="space-y-2">
            <span className="text-xs text-slate-400 font-mono">Table Skeleton</span>
            <div className="rounded-xl bg-[#0e1424] border border-slate-800 p-2">
              <TableRowSkeleton columns={3} />
              <TableRowSkeleton columns={3} />
              <TableRowSkeleton columns={3} />
            </div>
          </div>
        </div>
      </section>

      {/* Component Section 10: Empty State & Error State */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">10. Empty State & Error State</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EmptyState
            title="No Nodes Found"
            description="We could not find any active nodes matching your search filter criteria. Try adjusting the tags or chain type."
            actionLabel="Reset Search Filters"
            onAction={() => setSearchValue("")}
          />
          <ErrorState
            title="RPC Endpoint Unreachable"
            message="Failed to fetch network state from the requested endpoint. The node may be undergoing maintenance."
            errorDetails="Error: ECONNREFUSED 127.0.0.1:8545\nConnection timed out after 5000ms"
            onRetry={() => alert("Retrying RPC endpoint probe...")}
          />
        </div>
      </section>

      {/* Component Section 11: Pagination & Interactive Modal */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">11. Pagination & Dialog Modal</h2>
        <Card className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs text-slate-400 block font-mono">Interactive Pagination</span>
            <Pagination
              currentPage={currentPage}
              totalPages={8}
              onPageChange={(p) => setCurrentPage(p)}
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs text-slate-400 block font-mono">Accessible Modal Dialog</span>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Open Confirmation Modal
            </Button>
          </div>
        </Card>

        {/* Modal Instance */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Verify Node Deployment"
          description="Are you sure you want to initialize the local docker container for this validator?"
        >
          <div className="space-y-4 mt-2">
            <p className="text-xs text-slate-300 leading-relaxed">
              This action will pull the client image and mount storage volumes at <code className="text-cyan-400 font-mono">/var/lib/nodedrops/data</code>.
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  alert("Deployment initialized!");
                  setIsModalOpen(false);
                }}
              >
                Confirm & Launch
              </Button>
            </div>
          </div>
        </Modal>
      </section>
    </div>
  );
}
