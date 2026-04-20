import Image from "next/image";
import Link from "next/link";
import { listArticles } from "@/lib/api";
import { categoryLabel, formatDate } from "@/lib/format";

export default async function Hero() {
  "use cache";

  const { articles } = await listArticles({ featured: true, limit: 1 });
  const article = articles[0];

  if (!article) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="eyebrow">Vercel Daily</p>
        <h1 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
          Developer news, changelog entries, and deep dives — shipped daily.
        </h1>
      </section>
    );
  }

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-12 md:pt-14 md:pb-16">
        <Link
          href={`/articles/${article.slug}`}
          className="group grid grid-cols-1 items-center gap-8 md:grid-cols-[1.1fr_1fr] md:gap-12"
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md bg-surface-soft md:order-2">
            {article.image ? (
              <Image
                src={article.image}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition duration-500 group-hover:scale-[1.02]"
                priority
              />
            ) : null}
          </div>
          <div className="md:order-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
              <span className="rounded-sm bg-foreground px-2 py-0.5 font-mono uppercase tracking-widest text-background">
                Featured
              </span>
              <span className="text-muted">
                {categoryLabel(article.category)}
              </span>
              <span aria-hidden className="text-border-strong">
                ·
              </span>
              <time dateTime={article.publishedAt} className="text-muted">
                {formatDate(article.publishedAt)}
              </time>
            </div>
            <h1 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl md:text-[2.75rem]">
              <span className="group-hover:underline underline-offset-4 decoration-foreground/20">
                {article.title}
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground/70 md:text-lg">
              {article.excerpt}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div
                aria-hidden
                className="grid h-8 w-8 place-items-center rounded-full bg-surface-soft text-xs font-medium text-foreground"
              >
                {initials(article.author.name)}
              </div>
              <p className="text-sm text-muted">
                <span className="font-medium text-foreground">
                  {article.author.name}
                </span>
              </p>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
