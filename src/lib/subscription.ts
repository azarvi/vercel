import "server-only";
import { cookies } from "next/headers";
import { getSubscription } from "./api";

export const SUBSCRIPTION_COOKIE = "vd_sub";

const COOKIE_MAX_AGE = 60 * 60 * 24;

export async function getSubscriptionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SUBSCRIPTION_COOKIE)?.value ?? null;
}

export async function setSubscriptionToken(token: string) {
  const store = await cookies();
  store.set(SUBSCRIPTION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearSubscriptionToken() {
  const store = await cookies();
  store.delete(SUBSCRIPTION_COOKIE);
}

export async function isSubscribed(): Promise<boolean> {
  const token = await getSubscriptionToken();
  if (!token) return false;
  const sub = await getSubscription(token);
  return sub?.status === "active";
}
