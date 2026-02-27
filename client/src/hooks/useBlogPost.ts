/**
 * useBlogPost — fetches a single blog post by slug.
 *
 * Behaviour:
 *  1. If VITE_STRAPI_URL is not set, looks up the slug in the static blogData.
 *  2. Otherwise fetches from Strapi.
 *  3. On any error, falls back to the matching static post (or null).
 */

import { useState, useEffect } from "react";
import { blogPosts, type BlogPost } from "../data/blogData";
import {
  fetchBlogPostBySlug,
  isStrapiConfigured,
} from "../services/strapiService";

interface UseBlogPostResult {
  post: BlogPost | null;
  loading: boolean;
  /** Non-null only when Strapi fetch failed and we fell back to static data. */
  error: string | null;
}

export function useBlogPost(slug: string | undefined): UseBlogPostResult {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setPost(null);
      setLoading(false);
      return;
    }

    if (!isStrapiConfigured) {
      setPost(blogPosts.find((p) => p.slug === slug) ?? null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchBlogPostBySlug(slug)
      .then((data) => {
        if (cancelled) return;
        // If Strapi didn't find it, fall back to static
        setPost(data ?? blogPosts.find((p) => p.slug === slug) ?? null);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error("[useBlogPost] Strapi fetch failed:", err);
        setPost(blogPosts.find((p) => p.slug === slug) ?? null);
        setLoading(false);
        setError("Could not reach Strapi — showing cached content.");
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { post, loading, error };
}
