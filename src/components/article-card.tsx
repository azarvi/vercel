import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types";
import { categoryLabel, formatDate } from "@/lib/format";

type Props = {
  article: Article;
  priority?: boolean;
  variant?: "default" | "compact" | "wide" | "row";
};

export default function ArticleCard({
  article,
  priority,
  variant = "default",
}: Props) {
  if (variant === "wide") {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="group grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-surface-soft">
          {article.image ? (
            <Image
              src={article.image}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover transition duration-500 group-hover:scale-[1.02]"
              priority={priority}
            />
          ) : null}
        </div>
        <div className="flex flex-col justify-center gap-3">
          <Meta article={article} />
          <h3 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
            <span className="decoration-foreground/30 underline-offset-4 group-hover:underline">
              {article.title}
            </span>
          </h3>
          <p className="line-clamp-3 text-sm leading-relaxed text-foreground/70">
            {article.excerpt}
          </p>
          <p className="mt-1 text-xs text-muted">By {article.author.name}</p>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/articles/${article.slug}`} className="group flex gap-4">
        <div className="relative aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-md bg-surface-soft">
          {article.image ? (
            <Image
              src={article.image}
              alt={article.title}
              fill
              sizes="80px"
              className="object-cover transition duration-500 group-hover:scale-[1.04]"
              priority={priority}
            />
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <Meta article={article} />
          <h3 className="mt-1 text-[15px] font-semibold leading-snug tracking-tight">
            <span className="group-hover:underline">{article.title}</span>
          </h3>
        </div>
      </Link>
    );
  }

  if (variant === "row") {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="group flex items-start gap-5 border-b border-border py-5 last:border-b-0"
      >
        <div className="min-w-0 flex-1">
          <Meta article={article} />
          <h3 className="mt-1.5 text-base font-semibold leading-snug tracking-tight md:text-lg">
            <span className="group-hover:underline">{article.title}</span>
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-foreground/70">
            {article.excerpt}
          </p>
        </div>
        <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-md bg-surface-soft sm:w-36">
          {article.image ? (
            <Image
              src={article.image}
              alt={article.title}
              fill
              sizes="144px"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              priority={priority}
            />
          ) : null}
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/articles/${article.slug}`} className="group flex flex-col">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md bg-surface-soft">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
            priority={priority}
          />
        ) : null}
      </div>
      <div className="mt-4 flex flex-1 flex-col gap-2">
        <Meta article={article} />
        <h3 className="text-lg font-semibold leading-snug tracking-tight md:text-xl">
          <span className="decoration-foreground/30 underline-offset-4 group-hover:underline">
            {article.title}
          </span>
        </h3>
        <p className="line-clamp-2 text-sm text-foreground/70">
          {article.excerpt}
        </p>
      </div>
    </Link>
  );
}

function Meta({ article }: { article: Article }) {
  return (
    <p className="flex items-center gap-2 text-xs">
      <span className="rounded-sm border border-border bg-surface px-1.5 py-0.5 font-mono uppercase tracking-wider text-[10px] text-muted">
        {categoryLabel(article.category)}
      </span>
      <span className="text-muted">{formatDate(article.publishedAt)}</span>
    </p>
  );
}
