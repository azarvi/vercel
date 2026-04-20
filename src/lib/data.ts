import { unstable_cacheLife as cacheLife } from "next/cache";
import {
  getArticle,
  listArticles,
  listCategories,
  type ListArticlesParams,
} from "./api";

export async function getCachedArticle(slug: string) {
  "use cache";
  cacheLife("hours");
  return getArticle(slug);
}

export async function getCachedArticles(params: ListArticlesParams) {
  "use cache";
  cacheLife("minutes");
  return listArticles(params);
}

export async function getCachedCategories() {
  "use cache";
  cacheLife("hours");
  return listCategories();
}
