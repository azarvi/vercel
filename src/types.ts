export type Category =
  | "changelog"
  | "engineering"
  | "customers"
  | "company-news"
  | "community";

export type Author = {
  name: string;
  avatar: string;
};

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "blockquote"; text: string }
  | { type: "unordered-list"; items: string[] }
  | { type: "ordered-list"; items: string[] }
  | { type: "image"; src: string; alt: string; caption?: string };

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: ContentBlock[];
  category: Category;
  author: Author;
  image: string;
  publishedAt: string;
  featured: boolean;
  tags: string[];
};

export type BreakingNews = {
  id: string;
  headline: string;
  summary: string;
  articleId: string;
  category: Category;
  publishedAt: string;
  urgent: boolean;
};

export type CategoryInfo = {
  slug: Category;
  name: string;
  articleCount: number;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type Subscription = {
  token: string;
  status: "active" | "inactive";
  subscribedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
