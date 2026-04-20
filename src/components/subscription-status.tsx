import { isSubscribed } from "@/lib/subscription";
import { subscribe, unsubscribe } from "@/app/actions";

export default async function SubscriptionStatus() {
  const subscribed = await isSubscribed();

  if (subscribed) {
    return (
      <form action={unsubscribe} className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-emerald-500"
          />
          Subscribed
        </span>
        <button
          type="submit"
          className="text-xs text-muted hover:text-foreground hover:underline"
        >
          Unsubscribe
        </button>
      </form>
    );
  }

  return (
    <form action={subscribe}>
      <button
        type="submit"
        className="rounded-md bg-brand px-3.5 py-1.5 text-sm font-medium text-brand-foreground transition hover:bg-brand-soft"
      >
        Subscribe
      </button>
    </form>
  );
}
