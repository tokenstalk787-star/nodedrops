import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { getCategoryBySlug, getAllCategories } from "@/lib/repositories/category.repository";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { GuideCard } from "@/components/guide/GuideCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Layers, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/seo/schema";

interface CategoryDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found | NodeDrops",
      description: "The requested node category archive could not be found.",
    };
  }

  return {
    title: `${category.name} Guides | NodeDrops`,
    description:
      category.description ||
      `Explore step-by-step verified node deployment runbooks for ${category.name}.`,
    alternates: {
      canonical: `/categories/${category.slug}`,
    },
    openGraph: {
      title: `${category.name} Node Runbooks | NodeDrops`,
      description:
        category.description ||
        `Explore step-by-step verified node deployment runbooks for ${category.name}.`,
      url: `https://nodedrops.xyz/categories/${category.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} Node Runbooks | NodeDrops`,
      description:
        category.description ||
        `Explore step-by-step verified node deployment runbooks for ${category.name}.`,
    },
  };
}

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const { slug } = await params;
  const [category, allCategories] = await Promise.all([
    getCategoryBySlug(slug),
    getAllCategories(),
  ]);

  if (!category) {
    notFound();
  }

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: category.name, href: `/categories/${category.slug}`, current: true },
  ];

  const breadcrumbSchemaItems = [
    { name: "Home", url: "/" },
    { name: "Guides", url: "/guides" },
    { name: category.name, url: `/categories/${category.slug}` },
  ];

  const otherCategories = allCategories.filter((c) => c.slug !== category.slug);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      {/* Structured Data */}
      <JsonLd data={buildBreadcrumbSchema(breadcrumbSchemaItems)} />

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Category Header */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#070b16] p-6 sm:p-10">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="flex items-center gap-2">
              <Badge variant="cyan" size="md">
                <Layers className="w-3.5 h-3.5 mr-1" />
                Node Role Category
              </Badge>
              <Badge variant="neutral" size="md">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                {category.guides.length} Verified {category.guides.length === 1 ? "Runbook" : "Runbooks"}
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {category.name}
            </h1>

            {category.description && (
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {category.description}
              </p>
            )}

            <div className="pt-2 flex items-center gap-3">
              <Link href="/guides">
                <Button size="sm" variant="outline" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
                  All Guides
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Guides List in this Category */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Published Runbooks</span>
              <span className="text-xs font-mono font-normal text-slate-500">
                ({category.guides.length})
              </span>
            </h2>
          </div>

          {category.guides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.guides.map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <EmptyState
                title="No Guides in this Category Yet"
                description={`We are currently researching and testing verified runbooks for ${category.name}. Check back shortly or explore our other guides.`}
              />
              <div className="flex justify-center">
                <Link href="/guides">
                  <Button variant="primary" size="sm">
                    Browse All Guides
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Other Categories Switcher */}
        {otherCategories.length > 0 && (
          <section className="pt-10 border-t border-slate-800/80 space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Explore Other Node Categories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {otherCategories.map((other) => (
                <Link
                  key={other.id}
                  href={`/categories/${other.slug}`}
                  className="group p-4 rounded-xl border border-slate-800 bg-[#070b16] hover:border-cyan-500/40 hover:bg-[#0b1222] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {other.name}
                    </span>
                    {other.description && (
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {other.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>{other._count?.guides ?? 0} guides</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
