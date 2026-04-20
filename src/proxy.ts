import { NextResponse, type NextRequest } from "next/server";
import { SUBSCRIPTION_COOKIE } from "@/lib/subscription";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(SUBSCRIPTION_COOKIE)?.value;

  const headers = new Headers(request.headers);
  if (token) {
    headers.set("x-subscription-token", token);
  } else {
    headers.delete("x-subscription-token");
  }

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
