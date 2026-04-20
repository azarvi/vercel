import type {
  Article,
  BreakingNews,
  CategoryInfo,
  Pagination,
  Subscription,
} from "@/types";

const BASE = process.env.VNEWS_API_URL!;
const BYPASS = process.env.VNEWS_API_BYPASS_TOKEN!;

type Envelope<T> =
  | { success: true; data: T; meta?: { pagination: Pagination } }
  | { success: false; error: { code: string; message: string } };

type RequestOpts = {
  method?: "GET" | "POST" | "DELETE";
  headers?: Record<string, string>;
  cache?: RequestCache;
};

async function request<T>(path: string, opts: RequestOpts = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: opts.method ?? "GET",
    cache: opts.cache,
    headers: {
      "x-vercel-protection-bypass": BYPASS,
      ...opts.headers,
    },
  });

  const json = (await res.json()) as Envelope<T>;
  if (!json.success) {
    throw new Error(json.error.message || `API error ${res.status}`);
  }
  return json.data;
}

async function rawRequest<T>(
  path: string,
  opts: RequestOpts = {},
): Promise<{ data: T; headers: Headers }> {
  const res = await fetch(`${BASE}${path}`, {
    method: opts.method ?? "GET",
    cache: opts.cache,
    headers: {
      "x-vercel-protection-bypass": BYPASS,
      ...opts.headers,
    },
  });
  const json = (await res.json()) as Envelope<T>;
  if (!json.success) {
    throw new Error(json.error.message || `API error ${res.status}`);
  }
  return { data: json.data, headers: res.headers };
}

export type ListArticlesParams = {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  featured?: boolean;
};

export async function listArticles(
  params: ListArticlesParams = {},
): Promise<{ articles: Article[]; pagination: Pagination }> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.category) qs.set("category", params.category);
  if (params.search) qs.set("search", params.search);
  if (params.featured !== undefined) qs.set("featured", String(params.featured));

  const query = qs.toString();
  const path = query ? `/articles?${query}` : "/articles";

  const res = await fetch(`${BASE}${path}`, {
    headers: { "x-vercel-protection-bypass": BYPASS },
  });
  const json = (await res.json()) as Envelope<Article[]>;
  if (!json.success) throw new Error(json.error.message);
  return {
    articles: json.data,
    pagination: json.meta!.pagination,
  };
}

export async function getArticle(idOrSlug: string): Promise<Article | null> {
  const res = await fetch(`${BASE}/articles/${encodeURIComponent(idOrSlug)}`, {
    headers: { "x-vercel-protection-bypass": BYPASS },
  });
  if (res.status === 404) return null;
  const json = (await res.json()) as Envelope<Article>;
  if (!json.success) return null;
  return json.data;
}

export async function getTrending(exclude?: string[]): Promise<Article[]> {
  const qs = exclude?.length ? `?exclude=${exclude.join(",")}` : "";
  return request<Article[]>(`/articles/trending${qs}`, { cache: "no-store" });
}

export async function getBreakingNews(): Promise<BreakingNews> {
  return request<BreakingNews>("/breaking-news", { cache: "no-store" });
}

export async function listCategories(): Promise<CategoryInfo[]> {
  return request<CategoryInfo[]>("/categories");
}

export async function createSubscription(): Promise<{
  subscription: Subscription;
  token: string;
}> {
  const { data, headers } = await rawRequest<Subscription>(
    "/subscription/create",
    { method: "POST", cache: "no-store" },
  );
  const token = headers.get("x-subscription-token") ?? data.token;
  return { subscription: data, token };
}

export async function activateSubscription(
  token: string,
): Promise<Subscription> {
  return request<Subscription>("/subscription", {
    method: "POST",
    headers: { "x-subscription-token": token },
    cache: "no-store",
  });
}

export async function cancelSubscription(
  token: string,
): Promise<Subscription> {
  return request<Subscription>("/subscription", {
    method: "DELETE",
    headers: { "x-subscription-token": token },
    cache: "no-store",
  });
}

export async function getSubscription(
  token: string,
): Promise<Subscription | null> {
  const res = await fetch(`${BASE}/subscription`, {
    headers: {
      "x-vercel-protection-bypass": BYPASS,
      "x-subscription-token": token,
    },
    cache: "no-store",
  });
  if (res.status === 404) return null;
  const json = (await res.json()) as Envelope<Subscription>;
  if (!json.success) return null;
  return json.data;
}
