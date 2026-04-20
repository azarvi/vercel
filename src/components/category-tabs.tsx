import Link from "next/link";
import type { CategoryInfo } from "@/types";

type Props = {
  categories: CategoryInfo[];
  active?: string;
  includeAll?: boolean;
};

export default function CategoryTabs({
  categories,
  active,
  includeAll = true,
}: Props) {
  return (
    <nav
      aria-label="Categories"
      className="-mb-px flex flex-wrap items-end gap-x-6 gap-y-2 overflow-x-auto"
    >
      {includeAll ? (
        <TabLink href="/" active={!active}>
          All
        </TabLink>
      ) : null}
      {categories.map((c) => (
        <TabLink
          key={c.slug}
          href={`/category/${c.slug}`}
          active={active === c.slug}
        >
          {c.name}
          <span className="ml-1.5 text-xs text-muted">{c.articleCount}</span>
        </TabLink>
      ))}
    </nav>
  );
}

function TabLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        "inline-flex items-center border-b-2 px-0 pb-3 text-sm font-medium transition " +
        (active
          ? "border-foreground text-foreground"
          : "border-transparent text-muted hover:text-foreground")
      }
    >
      {children}
    </Link>
  );
}
