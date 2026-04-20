"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { Search } from "lucide-react";
import type { CategoryInfo } from "@/types";

type Props = {
  categories: CategoryInfo[];
};

export default function SearchForm({ categories }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const [query, setQuery] = useState(() => params.get("q") ?? "");
  const [category, setCategory] = useState(() => params.get("category") ?? "");
  const [isPending, startTransition] = useTransition();
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  function pushParams(q: string, c: string) {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (c) next.set("category", c);
    const qs = next.toString();
    startTransition(() => {
      router.replace(qs ? `/search?${qs}` : "/search");
    });
  }

  function onQueryChange(value: string) {
    setQuery(value);
    if (debounce.current) clearTimeout(debounce.current);
    if (value.length === 0 || value.length >= 3) {
      debounce.current = setTimeout(() => pushParams(value, category), 250);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (debounce.current) clearTimeout(debounce.current);
    pushParams(query, category);
  }

  function onCategoryChange(value: string) {
    setCategory(value);
    pushParams(query, value);
  }

  function clearAll() {
    setQuery("");
    setCategory("");
    pushParams("", "");
  }

  const hasFilters = query.length > 0 || category.length > 0;

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 rounded-md border border-border bg-surface p-4 shadow-sm sm:flex-row sm:items-center"
    >
      <div className="relative flex-1">
        <Search
          size={16}
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
        />
        <input
          type="search"
          placeholder="Search articles, authors, tags…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full rounded-md border border-border bg-background py-2.5 pr-3 pl-9 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
        />
      </div>
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name} ({c.articleCount})
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-brand-foreground transition hover:bg-brand-soft disabled:opacity-50"
          disabled={isPending}
        >
          {isPending ? "Searching…" : "Search"}
        </button>
        {hasFilters ? (
          <button
            type="button"
            onClick={clearAll}
            className="rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-muted transition hover:text-foreground"
          >
            Clear
          </button>
        ) : null}
      </div>
    </form>
  );
}
