import Link from "next/link";
import { Suspense } from "react";
import { Search, Triangle } from "lucide-react";
import SubscriptionStatus from "./subscription-status";
import HeaderCategories from "./header-categories";
import {
  CategoryNavSkeleton,
  SubscriptionStatusSkeleton,
} from "@/app/ui/skeletons";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3.5">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="Vercel Daily home"
        >
          <span
            aria-hidden
            className="grid h-7 w-7 place-items-center rounded-sm bg-foreground text-background"
          >
            <Triangle size={14} className="fill-current" strokeWidth={0} />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            Vercel Daily
          </span>
          <span className="hidden rounded-sm border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted sm:inline">
            Blog
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="flex items-center gap-4 text-sm"
        >
          <Link
            href="/"
            className="hidden text-foreground/80 transition hover:text-foreground sm:inline"
          >
            Home
          </Link>
          <Link
            href="/search"
            className="flex items-center gap-1.5 text-foreground/80 transition hover:text-foreground"
          >
            <Search size={15} aria-hidden />
            <span>Search</span>
          </Link>
          <div className="h-5 w-px bg-border" aria-hidden />
          <Suspense fallback={<SubscriptionStatusSkeleton />}>
            <SubscriptionStatus />
          </Suspense>
        </nav>
      </div>
      <div className="mx-auto max-w-7xl px-6">
        <Suspense fallback={<CategoryNavSkeleton />}>
          <HeaderCategories />
        </Suspense>
      </div>
    </header>
  );
}
