import { Suspense } from "react";
import type { Metadata } from "next";
import Hero from "@/components/hero";
import BreakingNewsBanner from "@/components/breaking-news-banner";
import FeaturedGrid from "@/components/featured-grid";
import { BreakingNewsSkeleton } from "@/app/ui/skeletons";

export const metadata: Metadata = {
  title: { absolute: "Vercel Daily — Developer news and insights" },
  description:
    "Featured stories, breaking news, and the latest updates from Vercel Daily.",
  openGraph: {
    title: "Vercel Daily — Developer news and insights",
    description: "Featured stories and breaking news for modern developers.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<BreakingNewsSkeleton />}>
        <BreakingNewsBanner />
      </Suspense>
      <Hero />
      <FeaturedGrid />
    </>
  );
}
