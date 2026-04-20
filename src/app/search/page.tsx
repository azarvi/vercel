import { Suspense } from "react";
import type { Metadata } from "next";
import { getCachedArticles, getCachedCategories } from "@/lib/data";
import ArticleCard from "@/components/article-card";
import SearchForm from "@/components/search-form";
import {
  SearchFormSkeleton,
  SearchResultsSkeleton,
} from "@/app/ui/skeletons";

type SearchParams = Promise<{ q?: string; category?: string }>;

export const metadata: Metadata = {
  title: "Search",
  description: "Search articles on Vercel Daily by keyword or category.",
  openGraph: {
    title: "Search — Vercel Daily",
    description: "Search articles on Vercel Daily by keyword or category.",
  },
};

export default function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
      <div className="max-w-3xl">
        <p className="eyebrow">Archive</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Search posts
        </h1>
        <p className="mt-3 text-base text-foreground/70">
          Find posts by keyword, tag, or category. Results update as you type.
        </p>
      </div>

      <div className="mt-10">
        <Suspense fallback={<SearchFormSkeleton />}>
          <SearchShell searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function SearchShell({ searchParams }: { searchParams: SearchParams }) {
  const [{ q = "", category = "" }, categories] = await Promise.all([
    searchParams,
    getCachedCategories(),
  ]);

  return (
    <>
      <SearchForm categories={categories} />
      <Suspense key={`${q}:${category}`} fallback={<SearchResultsSkeleton />}>
        <Results query={q} category={category} />
      </Suspense>
    </>
  );
}

async function Results({
  query,
  category,
}: {
  query: string;
  category: string;
}) {
  const hasQuery = query.trim().length > 0;

  const { articles } = await getCachedArticles({
    search: hasQuery ? query : undefined,
    category: category || undefined,
    limit: hasQuery ? 5 : 9,
  });

  if (articles.length === 0) {
    return (
      <div className="mt-10 rounded-md border border-dashed border-border bg-surface-soft px-6 py-16 text-center">
        <p className="eyebrow">Empty</p>
        <p className="mt-3 text-xl font-semibold tracking-tight">
          No posts found
          {query ? (
            <>
              {" "}
              for <span className="font-mono">“{query}”</span>
            </>
          ) : null}
          .
        </p>
        <p className="mt-2 text-sm text-muted">
          Try a different keyword or clear the filters.
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="mt-8 text-sm text-muted">
        {hasQuery
          ? `${articles.length} result${articles.length === 1 ? "" : "s"}`
          : "Recent articles"}
      </p>
      <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </>
  );
}

