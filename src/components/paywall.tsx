import { subscribe } from "@/app/actions";

export default function Paywall() {
  return (
    <div className="relative mt-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 inset-x-0 h-24 bg-gradient-to-b from-transparent to-background"
      />
      <div className="rounded-lg border border-border bg-surface p-8 text-center shadow-sm md:p-12">
        <p className="eyebrow text-accent-red">Members only</p>
        <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
          Keep reading — it&apos;s free.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base text-foreground/70">
          Subscribe to Vercel Daily for unlimited access to the full archive.
          No account required, no credit card, unsubscribe anytime.
        </p>
        <form
          action={subscribe}
          className="mt-7 flex flex-col items-center gap-3"
        >
          <button
            type="submit"
            className="rounded-md bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition hover:bg-brand-soft"
          >
            Subscribe to keep reading
          </button>
          <p className="text-xs text-muted">
            Session-based · no personal data stored
          </p>
        </form>
      </div>
    </div>
  );
}
