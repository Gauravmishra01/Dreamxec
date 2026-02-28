import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../Header';
import { Footer } from '../../Footer';
import { type BlogPost } from '../../../data/blogData';
import { useBlogPosts } from '../../../hooks/useBlogPosts';

const categoryColors: Record<string, string> = {
  Innovation: 'bg-dreamxec-orange text-white',
  Guides: 'bg-dreamxec-green text-white',
  Mentorship: 'bg-dreamxec-sky-blue text-white',
  Insights: 'bg-dreamxec-resolution-blue text-white',
  'Our Story': 'bg-dreamxec-saffron text-white',
  Impact: 'bg-dreamxec-dark-green text-white',
};

const BlogCard = ({ post }: { post: BlogPost }) => {
  const navigate = useNavigate();
  const badgeClass =
    categoryColors[post.category] ?? 'bg-dreamxec-navy text-white';

  return (
    <article
      className="card-pastel-offwhite rounded-xl border-4 border-dreamxec-navy shadow-pastel-card overflow-hidden group hover:scale-[1.02] hover:shadow-lg transition-all duration-300 flex flex-col h-full"
      role="article"
    >
      {/* Featured Image */}
      <div className="relative w-full aspect-video overflow-hidden flex-shrink-0">
        <img
          src={post.featuredImage}
          srcSet={post.featuredImageSrcSet}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {/* Category Badge */}
        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-bold border-2 border-dreamxec-navy shadow-sm font-display uppercase tracking-wide ${badgeClass}`}
        >
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="text-xs text-dreamxec-navy opacity-60 font-sans font-semibold">
            {post.date}
          </span>
          <span className="w-1 h-1 bg-dreamxec-navy opacity-40 rounded-full" />
          <span className="text-xs text-dreamxec-navy opacity-60 font-sans font-semibold">
            {post.readTime}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-extrabold text-dreamxec-navy font-display leading-snug mb-3 group-hover:text-dreamxec-orange transition-colors line-clamp-3 min-h-[4rem]">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-sm sm:text-base text-dreamxec-navy opacity-75 font-sans leading-relaxed line-clamp-3 flex-1 mb-5">
          {post.excerpt}
        </p>

        {/* Author + Read More */}
        <div className="flex items-center justify-between gap-3 mt-auto pt-4 border-t-2 border-dreamxec-navy/10">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={post.authorAvatar}
              alt={post.author}
              className="w-8 h-8 rounded-full border-2 border-dreamxec-navy object-cover flex-shrink-0"
              loading="lazy"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-dreamxec-navy font-sans truncate">
                {post.author}
              </p>
              <p className="text-xs text-dreamxec-navy opacity-55 font-sans truncate">
                {post.authorRole}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/blog/${post.slug}`)}
            className="flex-shrink-0 bg-dreamxec-orange border-2 border-dreamxec-navy text-white font-bold font-display text-sm px-4 py-2 rounded-xl hover:bg-dreamxec-saffron transition-colors shadow-sm whitespace-nowrap"
          >
            Read More →
          </button>
        </div>
      </div>
    </article>
  );
};

const BlogListing = () => {
  const { posts, loading } = useBlogPosts();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const CATEGORIES = useMemo(
    () => ['All', ...Array.from(new Set(posts.map((p) => p.category)))],
    [posts]
  );

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-[60vh] flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-dreamxec-navy border-t-dreamxec-orange animate-spin" />
            <p className="text-dreamxec-navy font-sans font-semibold opacity-60">Loading articles…</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const filtered = posts.filter((post) => {
    const matchesCategory =
      activeCategory === 'All' || post.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.tags.some((t) => t.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const [featured, ...rest] = filtered;

  return (
    <>
      <title>Blog | DreamXec — Student Innovation Insights</title>
      <meta
        name="description"
        content="Read the latest insights on student innovation, crowdfunding, mentorship, and the future of Indian education from the DreamXec team."
      />

      <Header />

      <main className="space-y-16 relative w-full py-12">

        {/* ── Hero ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="flex justify-center mb-2">
            <span className="text-5xl">✍️</span>
          </div>
          <h1 className="text-dreamxec-berkeley-blue text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight font-display">
            The DreamXec Blog
          </h1>
          <p className="text-dreamxec-navy text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium opacity-80">
            Insights on student innovation, crowdfunding, mentorship, and India's emerging research ecosystem — written by the people building it.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto mt-4">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dreamxec-navy opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="search"
                placeholder="Search articles…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-5 py-3 rounded-xl border-3 border-dreamxec-navy bg-white text-dreamxec-navy font-sans text-base shadow-sm focus:outline-none focus:ring-4 focus:ring-dreamxec-orange/30 placeholder:text-dreamxec-navy/40 transition-shadow"
              />
            </div>
          </div>
        </section>

        {/* ── Category Filter ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-xl border-3 font-bold font-display text-sm transition-all duration-200 hover:scale-105 active:scale-95 ${
                  activeCategory === cat
                    ? 'bg-dreamxec-orange border-dreamxec-navy text-white shadow-pastel-card'
                    : 'bg-white border-dreamxec-navy text-dreamxec-navy hover:bg-dreamxec-cream'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* ── Featured Post (first in filtered list) ── */}
        {featured && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-dreamxec-berkeley-blue text-2xl sm:text-3xl font-extrabold font-display mb-6">
              {activeCategory === 'All' && !searchQuery ? '⭐ Featured' : '📌 Top Result'}
            </h2>
            <FeaturedCard post={featured} />
          </section>
        )}

        {/* ── Remaining Posts Grid ── */}
        {rest.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-dreamxec-berkeley-blue text-2xl sm:text-3xl font-extrabold font-display mb-8">
              Latest Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* ── Empty State ── */}
        {filtered.length === 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="text-2xl font-bold text-dreamxec-navy font-display mb-2">
              No articles found
            </h3>
            <p className="text-dreamxec-navy opacity-60 font-sans text-base">
              Try a different search term or category.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="mt-6 bg-dreamxec-orange border-3 border-dreamxec-navy text-white font-bold font-display px-8 py-3 rounded-xl hover:bg-dreamxec-saffron transition-colors shadow-md"
            >
              Clear Filters
            </button>
          </section>
        )}

        {/* ── Newsletter CTA ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-pastel rounded-xl border-4 border-dreamxec-navy shadow-pastel-card p-8 sm:p-12 text-center space-y-6">
            <span className="text-4xl">📬</span>
            <h2 className="text-dreamxec-berkeley-blue text-2xl sm:text-3xl md:text-4xl font-extrabold font-display">
              Stay Updated on India's Student Innovation Revolution
            </h2>
            <p className="text-dreamxec-navy opacity-75 text-base sm:text-lg font-sans max-w-2xl mx-auto leading-relaxed">
              Get the latest stories, project spotlights, and insights delivered directly to your inbox. No spam, just impact.
            </p>
            <a
              href="/contact"
              className="inline-block bg-dreamxec-orange border-3 border-dreamxec-navy text-white font-bold font-display text-lg px-10 py-4 rounded-xl hover:bg-dreamxec-saffron transition-colors shadow-md hover:scale-105 active:scale-95"
            >
              Subscribe to Our Newsletter →
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

// ── Featured Post Card ──────────────────────────────────────────────
const FeaturedCard = ({ post }: { post: BlogPost }) => {
  const navigate = useNavigate();
  const badgeClass = categoryColors[post.category] ?? 'bg-dreamxec-navy text-white';

  return (
    <article
      className="card-pastel-offwhite rounded-xl border-4 border-dreamxec-navy shadow-pastel-card overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/blog/${post.slug}`)}
      role="article"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Image */}
        <div className="relative w-full aspect-video lg:aspect-auto lg:min-h-[360px] overflow-hidden">
          <img
            src={post.featuredImage}
            srcSet={post.featuredImageSrcSet}
            sizes="(max-width: 1024px) 100vw, 50vw"
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span
            className={`absolute top-4 left-4 px-3 py-1 rounded-lg text-xs font-bold border-2 border-dreamxec-navy shadow-sm font-display uppercase tracking-wide ${badgeClass}`}
          >
            {post.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-7 sm:p-10 flex flex-col justify-center gap-5">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-dreamxec-navy opacity-60 font-sans font-semibold">
              {post.date}
            </span>
            <span className="w-1 h-1 bg-dreamxec-navy opacity-40 rounded-full" />
            <span className="text-sm text-dreamxec-navy opacity-60 font-sans font-semibold">
              {post.readTime}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-dreamxec-navy font-display leading-snug group-hover:text-dreamxec-orange transition-colors">
            {post.title}
          </h2>

          <p className="text-base text-dreamxec-navy opacity-75 font-sans leading-relaxed line-clamp-4">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between gap-4 pt-4 border-t-2 border-dreamxec-navy/10 flex-wrap">
            <div className="flex items-center gap-3">
              <img
                src={post.authorAvatar}
                alt={post.author}
                className="w-10 h-10 rounded-full border-2 border-dreamxec-navy object-cover"
              />
              <div>
                <p className="text-sm font-bold text-dreamxec-navy font-sans">{post.author}</p>
                <p className="text-xs text-dreamxec-navy opacity-55 font-sans">{post.authorRole}</p>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/blog/${post.slug}`); }}
              className="bg-dreamxec-orange border-2 border-dreamxec-navy text-white font-bold font-display text-sm px-6 py-3 rounded-xl hover:bg-dreamxec-saffron transition-colors shadow-sm"
            >
              Read More →
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-1">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-dreamxec-cream border-2 border-dreamxec-navy/30 text-dreamxec-navy text-xs font-semibold font-sans rounded-lg"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogListing;
