import Link from "next/link";
import Image from "next/image";
import { getTrending } from "@/lib/api";
import { categoryLabel, formatDate } from "@/lib/format";

type Props = {
  excludeId?: string;
};

export default async function Trending({ excludeId }: Props) {
  const articles = await getTrending(excludeId ? [excludeId] : []);
  const list = articles.slice(0, 4);

  return (
    <aside className="lg:sticky lg:top-24">
      <p className="eyebrow">On the rise</p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight">Trending</h2>
      <ol className="mt-6 flex flex-col gap-5">
        {list.map((a, i) => (
          <li key={a.id}>
            <Link href={`/articles/${a.slug}`} className="group flex gap-4">
              <span className="pt-1 font-mono text-sm leading-none text-border-strong transition group-hover:text-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded bg-surface-soft">
                {a.image ? (
                  <Image
                    src={a.image}
                    alt={a.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="eyebrow">
                  {categoryLabel(a.category)} · {formatDate(a.publishedAt)}
                </p>
                <p className="mt-1 line-clamp-2 text-sm font-medium leading-snug group-hover:underline">
                  {a.title}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  );
}
