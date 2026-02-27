/**
 * Strapi CMS service for blog posts.
 *
 * Supports both Strapi v4 (fields inside `.attributes`) and
 * Strapi v5 (flat fields).  The mapper detects the format automatically.
 *
 * Environment variables (set in .env.local):
 *   VITE_STRAPI_URL   – base URL, e.g. http://localhost:1337
 *   VITE_STRAPI_TOKEN – optional read-only API token
 */

import axios from "axios";
import type { BlogPost } from "../data/blogData";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL as string | undefined;
const STRAPI_TOKEN = import.meta.env.VITE_STRAPI_TOKEN as string | undefined;

// ─── Axios instance ───────────────────────────────────────────────────────────

const strapiAxios = axios.create({
  baseURL: STRAPI_URL,
  headers: STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {},
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Resolves Strapi media fields to an absolute URL.
 * Handles:
 *  - Strapi v5 flat:  `{ url: "/uploads/..." }`
 *  - Strapi v4 nested: `{ data: { attributes: { url: "/uploads/..." } } }`
 *  - Already-absolute URL strings (e.g. Cloudinary / S3)
 *  - Plain string values (when the field is stored as a URL text field)
 */
function resolveMedia(media: unknown): string {
  if (!media) return "";

  if (typeof media === "string") {
    return media.startsWith("http") ? media : `${STRAPI_URL}${media}`;
  }

  // Strapi v5 flat image object
  if (typeof media === "object" && media !== null && "url" in media) {
    const url = (media as { url: string }).url;
    return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
  }

  // Strapi v4 nested image object { data: { attributes: { url } } }
  const v4 = media as { data?: { attributes?: { url?: string } } };
  const url = v4?.data?.attributes?.url;
  if (url) return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;

  return "";
}

/**
 * Format an ISO date string to the display format used in the UI
 * ("February 14, 2026").  Falls back to the raw value if parsing fails.
 */
function formatDate(raw: string | null | undefined): string {
  if (!raw) return "";
  try {
    return new Date(raw).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return raw;
  }
}

/**
 * Normalise a raw Strapi entry (v4 or v5) to the app's BlogPost type.
 */
function mapEntry(entry: Record<string, unknown>): BlogPost {
  // Strapi v4 wraps content fields inside .attributes; v5 is flat.
  const a = (entry.attributes as Record<string, unknown> | undefined) ?? entry;

  return {
    id: entry.id as number,
    slug: (a.slug as string) ?? "",
    title: (a.title as string) ?? "",
    excerpt: (a.excerpt as string) ?? "",
    featuredImage: resolveMedia(a.featuredImage),
    author: (a.author as string) ?? "",
    authorRole: (a.authorRole as string) ?? "",
    // authorAvatar can be a media field or a plain URL text field
    authorAvatar: resolveMedia(a.authorAvatar),
    date: formatDate(a.date as string),
    readTime: (a.readTime as string) ?? "",
    category: (a.category as string) ?? "",
    tags: Array.isArray(a.tags) ? (a.tags as string[]) : [],
    // content is stored as a JSON field in Strapi (array of BlogSection objects)
    content: Array.isArray(a.content) ? (a.content as BlogPost["content"]) : [],
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch all published blog posts from Strapi, sorted newest-first.
 */
export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const { data } = await strapiAxios.get("/api/blog-posts", {
    params: {
      populate: "featuredImage,authorAvatar",
      "sort[0]": "date:desc",
    },
  });

  return (data.data as Record<string, unknown>[]).map(mapEntry);
}

/**
 * Fetch a single blog post by its slug.
 * Returns `null` when not found.
 */
export async function fetchBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  const { data } = await strapiAxios.get("/api/blog-posts", {
    params: {
      "filters[slug][$eq]": slug,
      populate: "featuredImage,authorAvatar",
    },
  });

  const entries = data.data as Record<string, unknown>[];
  return entries.length ? mapEntry(entries[0]) : null;
}

/** True when VITE_STRAPI_URL is configured. */
export const isStrapiConfigured = Boolean(STRAPI_URL);
