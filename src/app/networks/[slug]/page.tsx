import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { NetworkOverview } from "@/components/network/detail/NetworkOverview";
import { NetworkTechnicalDetails } from "@/components/network/detail/NetworkTechnicalDetails";
import { OfficialSources } from "@/components/network/detail/OfficialSources";
import { RelatedGuides } from "@/components/network/detail/RelatedGuides";
import { getNetworkBySlug } from "@/lib/repositories/network.repository";

interface NetworkDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: NetworkDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const network = await getNetworkBySlug(slug);

  if (!network) {
    return {
      title: "Network Not Found — NodeDrops",
      description: "The requested blockchain network could not be found.",
    };
  }

  return {
    title: `${network.name} (${network.symbol}) Node Architecture & Specifications — NodeDrops`,
    description: `Learn how to run an ${network.name} node. Hardware requirements, client software (${network.clients.map((c) => c.name).join(", ")}), and verified runbooks.`,
  };
}

export default async function NetworkDetailPage({
  params,
}: NetworkDetailPageProps) {
  const { slug } = await params;
  const network = await getNetworkBySlug(slug);

  // Return proper 404 response if slug is unknown
  if (!network) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: "Networks", href: "/networks" },
          { label: network.name, href: `/networks/${network.slug}` },
        ]}
      />

      {/* 1. Header Overview & Risk Notice */}
      <NetworkOverview network={network} />

      {/* 2. Technical Details (Architecture, Clients, Hardware) */}
      <NetworkTechnicalDetails network={network} />

      {/* 3. Verified Upstream Sources */}
      <OfficialSources network={network} />

      {/* 4. Related Deployment Runbooks */}
      <RelatedGuides network={network} />
    </div>
  );
}
