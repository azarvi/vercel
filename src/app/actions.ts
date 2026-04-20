"use server";

import { revalidatePath } from "next/cache";
import {
  activateSubscription,
  cancelSubscription,
  createSubscription,
} from "@/lib/api";
import {
  clearSubscriptionToken,
  getSubscriptionToken,
  setSubscriptionToken,
} from "@/lib/subscription";

export async function subscribe() {
  const existing = await getSubscriptionToken();
  if (existing) {
    await activateSubscription(existing);
    revalidatePath("/", "layout");
    return;
  }

  const { token } = await createSubscription();
  await activateSubscription(token);
  await setSubscriptionToken(token);
  revalidatePath("/", "layout");
}

export async function unsubscribe() {
  const token = await getSubscriptionToken();
  if (!token) return;

  try {
    await cancelSubscription(token);
  } finally {
    await clearSubscriptionToken();
    revalidatePath("/", "layout");
  }
}
