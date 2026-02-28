import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from '../../Header';
import { Footer } from '../../Footer';
import { type BlogSection } from '../../../data/blogData';
import { useBlogPost } from '../../../hooks/useBlogPost';
import { useBlogPosts } from '../../../hooks/useBlogPosts';

const FALLBACK_COVER = '/assets/icon-pack/DX-ILLUSTRATION-PACK/1.svg';
const FALLBACK_AVATAR = '/assets/icon-pack/DX-ILLUSTRATION-PACK/12.svg';

const categoryColors: Record<string, string> = {
  Innovation: 'bg-dreamxec-orange text-white',
  Guides: 'bg-dreamxec-green text-white',
  Mentorship: 'bg-dreamxec-sky-blue text-white',
  Insights: 'bg-dreamxec-resolution-blue text-white',
  'Our Story': 'bg-dreamxec-saffron text-white',
  Impact: 'bg-dreamxec-dark-green text-white',
};

const ContentBlock = ({ block }: { block: BlogSection }) => {
  switch (block.type) {
    case 'heading':
      return (
        <h2 className="text-2xl sm:text-3xl font-extrabold text-dreamxec-navy font-display mt-12 mb-5 leading-tight">
          {block.text}
        </h2>
      );

    case 'subheading':
      return (
        <h3 className="text-xl sm:text-2xl font-bold text-dreamxec-navy font-display mt-9 mb-4 leading-snug">
          {block.text}
        </h3>
      );

    case 'paragraph':
      return (
        <p className="text-base sm:text-lg text-dreamxec-navy font-sans leading-[1.85] mb-5 opacity-90">
          {block.text}
        </p>
      );

    case 'quote':
      return (
        <blockquote className="my-8 card-pastel rounded-xl border-l-8 border-dreamxec-orange border-4 border-dreamxec-navy/20 p-6 sm:p-8 shadow-pastel-card">
          <p className="text-base sm:text-xl font-semibold text-dreamxec-navy font-sans leading-relaxed italic">
            {block.text}
          </p>
        </blockquote>
      );

    case 'bullet-list':
      return (
        <ul className="my-6 space-y-3 pl-2">
          {block.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 mt-1.5 w-2.5 h-2.5 rounded-full bg-dreamxec-orange border-2 border-dreamxec-navy inline-block" />
              <span className="text-base sm:text-lg text-dreamxec-navy font-sans leading-relaxed opacity-90">
                {item}
              </span>
            </li>
          ))}
        </ul>
      );

    case 'callout':
      return (
        <div className="my-8 card-pastel-offwhite rounded-xl border-4 border-dreamxec-orange shadow-pastel-card p-6 sm:p-8 flex gap-4 items-start">
          <span className="text-2xl flex-shrink-0 mt-0.5">💡</span>
          <p className="text-base sm:text-lg text-dreamxec-navy font-sans leading-relaxed font-semibold">
            {block.text}
          </p>
        </div>
      );

    default:
      return null;
  }
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { post, loading: postLoading } = useBlogPost(slug);
  const { posts, loading: postsLoading } = useBlogPosts();
  const loading = postLoading || postsLoading;

  const relatedPosts = posts
    .filter((p) => p.id !== post?.id && p.category === post?.category)
    .slice(0, 3);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-[60vh] flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-dreamxec-navy border-t-dreamxec-orange animate-spin" />
            <p className="text-dreamxec-navy font-sans font-semibold opacity-60">Loading article…</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Header />
        <main className="min-h-[60vh] flex flex-col items-center justify-center gap-6 py-20 px-4 text-center">
          <span className="text-6xl">📭</span>
          <h1 className="text-3xl font-extrabold text-dreamxec-navy font-display">
            Article Not Found
          </h1>
          <p className="text-dreamxec-navy opacity-60 font-sans text-lg max-w-md">
            The article you're looking for doesn't exist or may have been moved.
          </p>
          <button
            onClick={() => navigate('/blog')}
            className="bg-dreamxec-orange border-3 border-dreamxec-navy text-white font-bold font-display px-8 py-3 rounded-xl hover:bg-dreamxec-saffron transition-colors shadow-md"
          >
            ← Back to Blog
          </button>
        </main>
        <Footer />
      </>
    );
  }

  const badgeClass = categoryColors[post.category] ?? 'bg-dreamxec-navy text-white';
  const estimatedProgress = Math.min(100, 35 + posts.indexOf(post) * 12);

  return (
    <>
      <title>{post.title} | DreamXec Blog</title>
      <meta name="description" content={post.excerpt} />

      <Header />

      <main className="relative w-full">
        {/* ── Hero / Featured Image ── */}
        <section className="relative w-full max-h-[600px] overflow-hidden">
          <div className="relative w-full aspect-video max-h-[600px]">
            <img
              src={post.featuredImage || FALLBACK_COVER}
              srcSet={post.featuredImage ? post.featuredImageSrcSet : undefined}
              sizes="100vw"
              alt={post.title}
              className="w-full h-full object-cover"
              style={{ maxHeight: '600px' }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/50" />
          </div>

          {/* Category badge on image */}
          <span
            className={`absolute top-5 left-5 px-4 py-1.5 rounded-xl text-sm font-bold border-2 border-white/60 shadow-lg font-display uppercase tracking-wide ${badgeClass}`}
          >
            {post.category}
          </span>
        </section>

        {/* ── Content wrapper ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="flex flex-col lg:flex-row gap-12 items-start">

            {/* ── Main content column ── */}
            <article className="w-full lg:max-w-[760px] xl:max-w-[820px] min-w-0">
              {/* Back breadcrumb */}
              <button
                onClick={() => navigate('/blog')}
                className="flex items-center gap-2 text-dreamxec-navy hover:text-dreamxec-orange font-bold font-sans text-sm mb-6 transition-colors group"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Blog
              </button>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-dreamxec-navy font-display leading-tight mb-7">
                {post.title}
              </h1>

              {/* Author + Meta row */}
              <div className="flex flex-wrap items-center gap-5 pb-7 border-b-3 border-dreamxec-navy/15 mb-8">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar || FALLBACK_AVATAR}
                    alt={post.author}
                    className="w-12 h-12 rounded-full border-3 border-dreamxec-navy object-cover"
                  />
                  <div>
                    <p className="font-bold text-dreamxec-navy font-sans text-sm">{post.author}</p>
                    <p className="text-dreamxec-navy opacity-55 font-sans text-xs">{post.authorRole}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-wrap text-sm text-dreamxec-navy opacity-60 font-sans font-semibold">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {post.readTime}
                  </span>
                </div>
              </div>

              {/* Excerpt lead */}
              <p className="text-base sm:text-xl text-dreamxec-navy opacity-80 font-sans leading-relaxed font-semibold mb-8 p-5 bg-dreamxec-cream/60 rounded-xl border-l-4 border-dreamxec-orange">
                {post.excerpt}
              </p>

              {/* Blog content blocks */}
              <div>
                {post.content.map((block, i) => (
                  <ContentBlock key={i} block={block} />
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t-2 border-dreamxec-navy/10">
                <span className="text-sm font-bold text-dreamxec-navy font-sans opacity-60 mr-1">Tags:</span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-dreamxec-cream border-2 border-dreamxec-navy/30 text-dreamxec-navy text-xs font-semibold font-sans rounded-lg hover:border-dreamxec-orange hover:text-dreamxec-orange transition-colors cursor-default"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Share row */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <span className="text-sm font-bold text-dreamxec-navy font-sans opacity-60">Share:</span>
                {[
                  { label: 'Twitter / X', icon: '𝕏', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}` },
                  { label: 'LinkedIn', icon: 'in', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}` },
                  { label: 'WhatsApp', icon: '💬', url: `https://wa.me/?text=${encodeURIComponent(post.title + ' ' + window.location.href)}` },
                ].map(({ label, icon, url }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Share on ${label}`}
                    className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-dreamxec-navy rounded-xl text-dreamxec-navy font-bold font-sans text-sm hover:bg-dreamxec-orange hover:text-white hover:border-dreamxec-orange transition-all duration-200 shadow-sm"
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                  </a>
                ))}
              </div>

              {/* Author bio card */}
              <div className="mt-12 card-pastel rounded-xl border-4 border-dreamxec-navy shadow-pastel-card p-6 sm:p-8 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                <img
                  src={post.authorAvatar || FALLBACK_AVATAR}
                  alt={post.author}
                  className="w-20 h-20 rounded-full border-4 border-dreamxec-navy object-cover flex-shrink-0"
                />
                <div>
                  <p className="text-xs font-semibold text-dreamxec-navy opacity-55 font-sans uppercase tracking-wider mb-1">Written by</p>
                  <h3 className="text-xl font-extrabold text-dreamxec-navy font-display mb-1">{post.author}</h3>
                  <p className="text-sm text-dreamxec-orange font-bold font-sans mb-2">{post.authorRole}</p>
                  <p className="text-sm text-dreamxec-navy opacity-70 font-sans leading-relaxed">
                    A member of the DreamXec team, passionate about building the infrastructure for student innovation in India.
                  </p>
                </div>
              </div>
            </article>

            {/* ── Sidebar ── */}
            <aside className="w-full lg:w-[320px] xl:w-[360px] flex-shrink-0 space-y-8 lg:sticky lg:top-24">
              {/* Reading Progress – cosmetic */}
              <div className="card-pastel-offwhite rounded-xl border-3 border-dreamxec-navy shadow-pastel-card p-5">
                <p className="text-xs font-bold text-dreamxec-navy opacity-55 font-sans uppercase tracking-wider mb-3">
                  Article Details
                </p>
                <div className="space-y-3 text-sm font-sans text-dreamxec-navy">
                  <div className="flex justify-between">
                    <span className="opacity-60">Category</span>
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border border-dreamxec-navy/20 ${badgeClass}`}>{post.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-60">Reading Time</span>
                    <span className="font-bold">{post.readTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-60">Published</span>
                    <span className="font-bold">{post.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="opacity-60">Length</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-dreamxec-cream rounded-full border border-dreamxec-navy/20 overflow-hidden">
                        <div className="h-full bg-dreamxec-orange rounded-full" style={{ width: `${estimatedProgress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="card-pastel-offwhite rounded-xl border-3 border-dreamxec-navy shadow-pastel-card p-5 space-y-5">
                  <h3 className="text-base font-extrabold text-dreamxec-navy font-display">
                    Related Articles
                  </h3>
                  {relatedPosts.map((related) => (
                    <button
                      key={related.id}
                      onClick={() => navigate(`/blog/${related.slug}`)}
                      className="w-full text-left flex gap-3 group hover:bg-dreamxec-cream rounded-lg p-2 -mx-2 transition-colors"
                    >
                      <img
                        src={related.featuredImage || FALLBACK_COVER}
                        alt={related.title}
                        className="w-16 h-14 rounded-lg border-2 border-dreamxec-navy object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-dreamxec-navy font-display leading-snug line-clamp-2 group-hover:text-dreamxec-orange transition-colors">
                          {related.title}
                        </p>
                        <p className="text-xs text-dreamxec-navy opacity-50 font-sans mt-1">
                          {related.readTime}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* All posts in this category */}
              <div className="card-pastel rounded-xl border-3 border-dreamxec-navy shadow-pastel-card p-5 space-y-4 text-center">
                <span className="text-2xl">📚</span>
                <h3 className="text-base font-extrabold text-dreamxec-navy font-display">
                  Explore All {post.category} Articles
                </h3>
                <button
                  onClick={() => navigate('/blog')}
                  className="w-full bg-dreamxec-orange border-2 border-dreamxec-navy text-white font-bold font-display text-sm px-5 py-2.5 rounded-xl hover:bg-dreamxec-saffron transition-colors shadow-sm"
                >
                  View All Articles →
                </button>
              </div>
            </aside>
          </div>
        </div>

        {/* ── More Articles ── */}
        {posts.filter((p) => p.id !== post.id).length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-dreamxec-navy font-display mb-8">
              More From the Blog
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {posts
                .filter((p) => p.id !== post.id)
                .slice(0, 3)
                .map((p) => {
                  const bc = categoryColors[p.category] ?? 'bg-dreamxec-navy text-white';
                  return (
                    <button
                      key={p.id}
                      onClick={() => navigate(`/blog/${p.slug}`)}
                      className="text-left card-pastel-offwhite rounded-xl border-3 border-dreamxec-navy shadow-pastel-card overflow-hidden group hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={p.featuredImage || FALLBACK_COVER}
                          srcSet={p.featuredImage ? p.featuredImageSrcSet : undefined}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                        <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-lg text-xs font-bold border border-white/60 font-display uppercase ${bc}`}>
                          {p.category}
                        </span>
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-dreamxec-navy opacity-50 font-sans font-semibold mb-2">{p.date} · {p.readTime}</p>
                        <h3 className="text-base font-bold text-dreamxec-navy font-display line-clamp-2 group-hover:text-dreamxec-orange transition-colors mb-2">
                          {p.title}
                        </h3>
                        <p className="text-sm text-dreamxec-navy opacity-65 font-sans line-clamp-2">{p.excerpt}</p>
                      </div>
                    </button>
                  );
                })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
};

export default BlogPost;
