"use client";

import { Triangle } from "lucide-react";

const TOPICS = [
  { slug: "changelog", name: "Changelog" },
  { slug: "engineering", name: "Engineering" },
  { slug: "customers", name: "Customers" },
  { slug: "company-news", name: "Company News" },
  { slug: "community", name: "Community" },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-border bg-brand text-brand-foreground">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="grid h-9 w-9 place-items-center rounded-sm bg-brand-foreground text-brand"
              >
                <Triangle size={16} className="fill-current" strokeWidth={0} />
              </span>
              <span className="text-base font-semibold">Vercel Daily</span>
            </div>
            <p className="mt-4 text-sm text-brand-foreground/70">
              The latest news, tutorials, and insights for modern web
              developers. Shipped daily.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="eyebrow !text-brand-foreground/60">Read</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a href="/" className="hover:underline">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/search" className="hover:underline">
                    Search
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="eyebrow !text-brand-foreground/60">Follow</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a
                    href="https://twitter.com/vercel"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/vercel"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="eyebrow !text-brand-foreground/60">Topics</p>
              <ul className="mt-3 space-y-2 text-sm">
                {TOPICS.map((t) => (
                  <li key={t.slug}>
                    <a
                      href={`/category/${t.slug}`}
                      className="hover:underline"
                    >
                      {t.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-brand-foreground/15 pt-6 text-xs text-brand-foreground/60 sm:flex-row sm:items-center">
          <p>© {year} Vercel Daily. All rights reserved.</p>
          <p className="font-mono">Made with Next.js 16 on Vercel.</p>
        </div>
      </div>
    </footer>
  );
}
