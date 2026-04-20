export function BreakingNewsSkeleton() {
  return (
    <div className="bg-brand">
      <div className="mx-auto max-w-7xl px-6 py-2.5">
        <div className="h-4 w-48 animate-pulse rounded bg-brand-soft" />
      </div>
    </div>
  );
}

export function CategoryNavSkeleton() {
  return (
    <div className="flex gap-6 overflow-x-auto py-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="h-4 w-20 shrink-0 animate-pulse rounded bg-surface-soft"
        />
      ))}
    </div>
  );
}

export function SubscriptionStatusSkeleton() {
  return <span className="h-8 w-24 animate-pulse rounded-md bg-surface-soft" />;
}

export function ArticleSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-6 pt-16">
      <div className="h-4 w-32 animate-pulse rounded bg-surface-soft" />
      <div className="mt-6 h-12 w-full animate-pulse rounded bg-surface-soft" />
      <div className="mt-2 h-12 w-3/4 animate-pulse rounded bg-surface-soft" />
      <div className="mt-10 aspect-[2/1] w-full animate-pulse rounded-md bg-surface-soft" />
    </div>
  );
}

export function ArticleBodySkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-4 w-full animate-pulse rounded bg-surface-soft"
        />
      ))}
    </div>
  );
}

export function TrendingSkeleton() {
  return (
    <aside>
      <div className="h-3 w-24 animate-pulse rounded bg-surface-soft" />
      <div className="mt-3 h-6 w-32 animate-pulse rounded bg-surface-soft" />
      <div className="mt-6 flex flex-col gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-16 w-20 animate-pulse rounded bg-surface-soft" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-20 animate-pulse rounded bg-surface-soft" />
              <div className="h-4 w-full animate-pulse rounded bg-surface-soft" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export function SearchFormSkeleton() {
  return (
    <div className="h-20 animate-pulse rounded-md border border-border bg-surface" />
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className="aspect-[16/10] w-full animate-pulse rounded-md bg-surface-soft" />
          <div className="h-3 w-24 animate-pulse rounded bg-surface-soft" />
          <div className="h-6 w-full animate-pulse rounded bg-surface-soft" />
        </div>
      ))}
    </div>
  );
}

export function CategoryHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-4 w-24 animate-pulse rounded bg-surface-soft" />
      <div className="h-10 w-64 animate-pulse rounded bg-surface-soft" />
      <div className="h-4 w-80 animate-pulse rounded bg-surface-soft" />
    </div>
  );
}

export function CategoryGridSkeleton() {
  return (
    <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className="aspect-[16/10] w-full animate-pulse rounded-md bg-surface-soft" />
          <div className="h-3 w-24 animate-pulse rounded bg-surface-soft" />
          <div className="h-6 w-full animate-pulse rounded bg-surface-soft" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-surface-soft" />
        </div>
      ))}
    </div>
  );
}
