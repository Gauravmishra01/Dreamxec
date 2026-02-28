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

// ─── Image types ──────────────────────────────────────────────────────────────

/** The responsive-image data we expose to components. */
export interface StrapiImage {
  url: string;
  width?: number;
  height?: number;
  /** Pre-built srcSet string for <img srcSet> */
  srcSet?: string;
  /** Map of breakpoint name → url for manual selection */
  formats?: Record<string, string>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Prefix a relative path with the Strapi host. */
function absUrl(url: string): string {
  if (!url) return "";
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
}

/**
 * Resolves Strapi media fields to a full StrapiImage object.
 *
 * Handles:
 *  - Strapi v5 flat:  `{ url, width, height, formats: { small, medium, … } }`
 *  - Strapi v4 nested: `{ data: { attributes: { url, formats } } }`
 *  - Already-absolute URL strings (e.g. Cloudinary / S3)
 *  - Plain string values (when the field is stored as a URL text field)
 */
function resolveImage(media: unknown): StrapiImage {
  if (!media) return { url: "" };

  // Plain string (external URL or relative path)
  if (typeof media === "string") {
    return { url: absUrl(media) };
  }

  // Unwrap Strapi v4 envelope if present
  let obj = media as Record<string, unknown>;
  if (obj.data && typeof obj.data === "object" && obj.data !== null) {
    const v4inner = obj.data as Record<string, unknown>;
    obj = (v4inner.attributes as Record<string, unknown>) ?? v4inner;
  }

  const url = absUrl((obj.url as string) ?? "");
  const width = (obj.width as number) ?? undefined;
  const height = (obj.height as number) ?? undefined;

  // Build formats map + srcSet from Strapi-generated responsive sizes
  const rawFormats = obj.formats as
    | Record<string, Record<string, unknown>>
    | undefined;
  const formats: Record<string, string> = {};
  const srcSetParts: string[] = [];

  if (rawFormats && typeof rawFormats === "object") {
    for (const [key, fmt] of Object.entries(rawFormats)) {
      if (fmt && typeof fmt === "object" && fmt.url) {
        const fmtUrl = absUrl(fmt.url as string);
        const fmtW = fmt.width as number | undefined;
        formats[key] = fmtUrl;
        if (fmtW) {
          srcSetParts.push(`${fmtUrl} ${fmtW}w`);
        }
      }
    }
  }

  // Add the original as the largest entry
  if (url && width) {
    srcSetParts.push(`${url} ${width}w`);
  }

  // Sort by width ascending
  srcSetParts.sort((a, b) => {
    const aW = parseInt(a.split(" ").pop()!);
    const bW = parseInt(b.split(" ").pop()!);
    return aW - bW;
  });

  return {
    url,
    width,
    height,
    srcSet: srcSetParts.length > 1 ? srcSetParts.join(", ") : undefined,
    formats: Object.keys(formats).length ? formats : undefined,
  };
}

/** Backwards-compatible: resolve to a plain URL string. */
function resolveMedia(media: unknown): string {
  return resolveImage(media).url;
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

  const featuredImg = resolveImage(a.featuredImage);
  const avatarImg = resolveImage(a.authorAvatar);

  return {
    id: entry.id as number,
    slug: (a.slug as string) ?? "",
    title: (a.title as string) ?? "",
    excerpt: (a.excerpt as string) ?? "",
    featuredImage: featuredImg.url,
    featuredImageSrcSet: featuredImg.srcSet,
    featuredImageFormats: featuredImg.formats,
    author: (a.author as string) ?? "",
    authorRole: (a.authorRole as string) ?? "",
    authorAvatar: avatarImg.url,
    date: formatDate(a.date as string),
    readTime: (a.readTime as string) ?? "",
    category: (a.category as string) ?? "",
    tags: Array.isArray(a.tags) ? (a.tags as string[]) : [],
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
