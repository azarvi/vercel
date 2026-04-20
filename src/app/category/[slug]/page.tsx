import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCachedArticles, getCachedCategories } from "@/lib/data";
import { ArrowLeft } from "lucide-react";
import ArticleCard from "@/components/article-card";
import CategoryTabs from "@/components/category-tabs";
import {
  CategoryGridSkeleton,
  CategoryHeaderSkeleton,
} from "@/app/ui/skeletons";
import { categoryLabel } from "@/lib/format";

const CATEGORY_LIMIT = 12;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const label = categoryLabel(slug);
  const description = `Articles from the ${label} category on Vercel Daily.`;
  return {
    title: label,
    description,
    openGraph: {
      title: `${label} — Vercel Daily`,
      description,
      type: "website",
    },
  };
}

export default function CategoryPage({ params }: Props) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
      <Suspense fallback={<CategoryHeaderSkeleton />}>
        <CategoryHeader params={params} />
      </Suspense>
      <Suspense fallback={<CategoryGridSkeleton />}>
        <CategoryGrid params={params} />
      </Suspense>
    </div>
  );
}

async function CategoryHeader({ params }: Props) {
  const { slug } = await params;
  const categories = await getCachedCategories();

  const match = categories.find((c) => c.slug === slug);
  if (!match) notFound();

  return (
    <>
      <div className="flex flex-col gap-5">
        <Link
          href="/"
          className="eyebrow inline-flex items-center gap-2 hover:text-foreground"
        >
          <ArrowLeft size={12} aria-hidden /> All topics
        </Link>
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {match.name}
          </h1>
          <span className="text-sm text-muted">
            {match.articleCount}{" "}
            {match.articleCount === 1 ? "article" : "articles"}
          </span>
        </div>
        <p className="max-w-2xl text-foreground/70">
          The latest posts tagged <span className="font-mono">{slug}</span>.
        </p>
      </div>

      <div className="mt-8 border-b border-border">
        <CategoryTabs categories={categories} active={slug} />
      </div>
    </>
  );
}

async function CategoryGrid({ params }: Props) {
  const { slug } = await params;
  const { articles } = await getCachedArticles({
    category: slug,
    limit: CATEGORY_LIMIT,
  });

  if (articles.length === 0) {
    return (
      <div className="mt-16 rounded-md border border-dashed border-border px-6 py-16 text-center">
        <p className="eyebrow">Empty</p>
        <p className="mt-2 text-xl font-semibold tracking-tight">
          No articles in this category yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

