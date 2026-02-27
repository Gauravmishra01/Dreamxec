/**
 * useBlogPosts — fetches all blog posts.
 *
 * Behaviour:
 *  1. If VITE_STRAPI_URL is not set, returns the static blogData immediately.
 *  2. Otherwise fetches from Strapi and maps to BlogPost[].
 *  3. On any network/API error, falls back to the static blogData so the
 *     page always has content to show.
 */

import { useState, useEffect } from "react";
import { blogPosts, type BlogPost } from "../data/blogData";
import { fetchBlogPosts, isStrapiConfigured } from "../services/strapiService";

interface UseBlogPostsResult {
  posts: BlogPost[];
  loading: boolean;
  /** Non-null only when Strapi fetch failed and we fell back to static data. */
  error: string | null;
}

export function useBlogPosts(): UseBlogPostsResult {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isStrapiConfigured) {
      setPosts(blogPosts);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchBlogPosts()
      .then((data) => {
        if (cancelled) return;
        // If Strapi returned nothing, fall back to static data
        setPosts(data.length ? data : blogPosts);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error("[useBlogPosts] Strapi fetch failed:", err);
        setPosts(blogPosts);
        setLoading(false);
        setError("Could not reach Strapi — showing cached content.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { posts, loading, error };
}
