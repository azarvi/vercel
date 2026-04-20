import Link from "next/link";
import { listArticles, listCategories } from "@/lib/api";
import type { Article } from "@/types";
import ArticleCard from "./article-card";

export default async function FeaturedGrid() {
  "use cache";

  const [{ articles: latest }, categories] = await Promise.all([
    listArticles({ limit: 9 }),
    listCategories(),
  ]);

  if (latest.length === 0) return null;

  const [lead, ...rest] = latest;
  const latestGrid = rest.slice(0, 6);

  const byCategory = await Promise.all(
    categories.map(async (c) => {
      const { articles } = await listArticles({
        category: c.slug,
        limit: 3,
      });
      return { category: c, articles };
    }),
  );

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <SectionHead
          eyebrow="Latest"
          title="Fresh posts"
          href={null}
          meta="Across every topic"
        />
        <div className="mt-8">
          <ArticleCard article={lead} priority variant="wide" />
        </div>
        <div className="mt-12 grid grid-cols-1 gap-10 border-t border-border pt-12 md:grid-cols-2 lg:grid-cols-3">
          {latestGrid.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </section>

      {byCategory
        .filter((g) => g.articles.length > 0)
        .map(({ category, articles }) => (
          <CategorySection
            key={category.slug}
            slug={category.slug}
            name={category.name}
            articles={articles}
          />
        ))}
    </>
  );
}

function CategorySection({
  slug,
  name,
  articles,
}: {
  slug: string;
  name: string;
  articles: Article[];
}) {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <SectionHead
          eyebrow={name}
          title={`More from ${name}`}
          href={`/category/${slug}`}
          meta="View all →"
        />
        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHead({
  eyebrow,
  title,
  href,
  meta,
}: {
  eyebrow: string;
  title: string;
  href: string | null;
  meta?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          {title}
        </h2>
      </div>
      {href && meta ? (
        <Link
          href={href}
          className="shrink-0 text-sm font-medium text-muted transition hover:text-foreground"
        >
          {meta}
        </Link>
      ) : meta ? (
        <span className="hidden shrink-0 text-sm text-muted md:block">
          {meta}
        </span>
      ) : null}
    </div>
  );
}
