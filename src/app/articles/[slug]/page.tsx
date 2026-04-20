import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getCachedArticle } from "@/lib/data";
import { isSubscribed } from "@/lib/subscription";
import { categoryLabel, formatDate } from "@/lib/format";
import { ArrowLeft } from "lucide-react";
import ArticleContent from "@/components/article-content";
import Paywall from "@/components/paywall";
import PlayAudioButton from "@/components/play-audio-button";
import Trending from "@/components/trending";
import {
  ArticleSkeleton,
  ArticleBodySkeleton,
  TrendingSkeleton,
} from "@/app/ui/skeletons";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getCachedArticle(slug);
  if (!article) return { title: "Article not found" };

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      images: article.image ? [{ url: article.image }] : undefined,
      publishedTime: article.publishedAt,
      authors: [article.author.name],
    },
  };
}

export default function ArticlePage({ params }: Props) {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <ArticleView params={params} />
    </Suspense>
  );
}

async function ArticleView({ params }: Props) {
  const { slug } = await params;
  const [article, subscribed] = await Promise.all([
    getCachedArticle(slug),
    isSubscribed(),
  ]);
  if (!article) notFound();

  const audioBlocks = subscribed
    ? article.content
    : [
        ...article.content.filter((b) => b.type === "paragraph").slice(0, 1),
        {
          type: "paragraph" as const,
          text: "Subscribe to Vercel Daily to keep listening to the rest of this article.",
        },
      ];

  return (
    <article>
      <header className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 pt-10 pb-12 md:pt-16">
          <Link
            href="/"
            className="eyebrow inline-flex items-center gap-2 hover:text-foreground"
          >
            <ArrowLeft size={12} aria-hidden /> Back to home
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <Link
              href={`/category/${article.category}`}
              className="rounded-sm border border-border bg-surface px-2 py-0.5 font-mono uppercase tracking-widest text-[10px] text-muted transition hover:text-foreground"
            >
              {categoryLabel(article.category)}
            </Link>
            <time dateTime={article.publishedAt} className="text-muted">
              {formatDate(article.publishedAt)}
            </time>
            <span aria-hidden className="text-border-strong">
              ·
            </span>
            <span className="text-muted">
              {estimateReadingMinutes(article.content)} min read
            </span>
            <PlayAudioButton
              title={article.title}
              excerpt={article.excerpt}
              blocks={audioBlocks}
            />
          </div>
          <h1 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-foreground/70 md:text-lg">
            {article.excerpt}
          </p>
          <div className="mt-7 flex items-center gap-3">
            <div
              aria-hidden
              className="grid h-9 w-9 place-items-center rounded-full bg-surface-soft text-xs font-medium text-foreground"
            >
              {authorInitials(article.author.name)}
            </div>
            <div className="text-sm leading-tight">
              <p className="font-medium">{article.author.name}</p>
              <p className="text-xs text-muted">Staff writer</p>
            </div>
          </div>
        </div>
      </header>

      {article.image ? (
        <div className="mx-auto max-w-6xl px-6">
          <div className="relative -mt-4 aspect-[16/9] w-full overflow-hidden rounded-md bg-surface-soft md:-mt-6 md:aspect-[2.4/1]">
            <Image
              src={article.image}
              alt={article.title}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      ) : null}

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_280px] md:py-20">
        <div className="min-w-0">
          <Suspense fallback={<ArticleBodySkeleton />}>
            <ArticleBody slug={slug} />
          </Suspense>
          <div className="mt-16 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <Suspense fallback={<TrendingSkeleton />}>
          <Trending excludeId={article.id} />
        </Suspense>
      </div>
    </article>
  );
}

async function ArticleBody({ slug }: { slug: string }) {
  const [article, subscribed] = await Promise.all([
    getCachedArticle(slug),
    isSubscribed(),
  ]);
  if (!article) return null;

  if (!subscribed) {
    const teaser = article.content.find((b) => b.type === "paragraph");
    return (
      <>
        {teaser ? <ArticleContent blocks={[teaser]} /> : null}
        <Paywall />
      </>
    );
  }

  return <ArticleContent blocks={article.content} />;
}

function estimateReadingMinutes(
  blocks: { type: string; text?: string; items?: string[] }[],
): number {
  const words = blocks.reduce((n, b) => {
    if (b.text) return n + b.text.split(/\s+/).length;
    if (b.items) return n + b.items.join(" ").split(/\s+/).length;
    return n;
  }, 0);
  return Math.max(1, Math.round(words / 220));
}

function authorInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

