const CATEGORY_LABELS: Record<string, string> = {
  changelog: "Changelog",
  engineering: "Engineering",
  customers: "Customers",
  "company-news": "Company News",
  community: "Community",
};

export function categoryLabel(slug: string): string {
  return CATEGORY_LABELS[slug] ?? slug;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
