import Link from "next/link";
import { getBreakingNews } from "@/lib/api";

export default async function BreakingNewsBanner() {
  const news = await getBreakingNews();

  return (
    <Link
      href={`/articles/${news.articleId}`}
      className="group block bg-brand text-brand-foreground"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-2.5 text-sm">
        <span className="flex shrink-0 items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.18em]">
          <span
            aria-hidden
            className="live-dot inline-block h-2 w-2 rounded-full bg-accent-red"
          />
          {news.urgent ? "Breaking" : "Latest"}
        </span>
        <span className="h-4 w-px bg-brand-foreground/25" aria-hidden />
        <span className="truncate font-medium">
          {news.headline}
          <span className="ml-2 hidden font-normal text-brand-foreground/60 md:inline">
            — {news.summary}
          </span>
        </span>
        <span className="ml-auto hidden shrink-0 text-xs text-brand-foreground/70 group-hover:text-brand-foreground md:inline">
          Read →
        </span>
      </div>
    </Link>
  );
}
