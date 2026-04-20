import Link from "next/link";
import { getCachedCategories } from "@/lib/data";

export default async function HeaderCategories() {
  const categories = await getCachedCategories();

  return (
    <nav
      aria-label="Categories"
      className="flex items-center gap-6 overflow-x-auto py-2 text-sm"
    >
      <Link
        href="/"
        className="shrink-0 text-foreground/80 transition hover:text-foreground"
      >
        Latest
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/category/${c.slug}`}
          className="shrink-0 text-muted transition hover:text-foreground"
        >
          {c.name}
        </Link>
      ))}
    </nav>
  );
}
