import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicClubs } from "../services/clubService";
import { StarDecoration } from "./icons/StarDecoration";
import { FooterContent } from "../sections/Footer/components/FooterContent";

type SortOption = "newest" | "oldest";

/* ─────────────────────────────────────────────
   ICONS
───────────────────────────────────────────── */
const TrophyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 5h-2V3H7v2H5C3.9 5 3 5.9 3 7v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V18H7v2h10v-2h-4v-2.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
  </svg>
);
const BuildingIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.7L19 12v7H5v-7l7-6.3z M10 17v-3h4v3h-4z" />
  </svg>
);
const CampaignIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z" />
  </svg>
);
const FundsIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c4.86-2.34 8-7 8-11.5C20 5.81 16.19 2 11.5 2zm1 14.5h-2v-2h2v2zm0-4h-2c0-3.25 3-3 3-5 0-1.1-.9-2-2-2s-2 .9-2 2h-2c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.5-3 2.75-3 5z" />
  </svg>
);
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const SortIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M7 12h10M11 18h2" />
  </svg>
);

/* ─────────────────────────────────────────────
   CLUB CARD — neobrutalist
───────────────────────────────────────────── */
const cardAccents = [
  { stripe: '#FF7F00', shadow: '#FF7F00', statBg: '#fff7ed', statBorder: '#FF7F00', statText: '#FF7F00' },
  { stripe: '#0B9C2C', shadow: '#0B9C2C', statBg: '#f0fdf4', statBorder: '#0B9C2C', statText: '#0B9C2C' },
  { stripe: '#000080', shadow: '#000080', statBg: '#eff6ff', statBorder: '#000080', statText: '#000080' },
];

function ClubCard({ club, index }: { club: any; index: number }) {
  const isTopRaiser = club.totalRaised > 100000;
  const acc = cardAccents[index % 3];

  const raisedDisplay = club.totalRaised >= 100000
    ? `₹${(club.totalRaised / 100000).toFixed(1)}L`
    : `₹${club.totalRaised.toLocaleString("en-IN")}`;

  return (
    <Link
      to={`/clubs/${club.slug}`}
      className="group relative flex flex-col bg-white transition-all duration-200 hover:translate-x-[-3px] hover:translate-y-[-3px]"
      style={{
        border: '3px solid #000080',
        boxShadow: `6px 6px 0 ${acc.shadow}`,
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Top color stripe */}
      <div className="h-2" style={{ background: acc.stripe }} />

      {/* Top-raiser badge */}
      {isTopRaiser && (
        <div
          className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 text-[10px] sm:text-xs font-black uppercase tracking-wide text-white z-10"
          style={{ background: '#FF7F00', border: '2px solid #000080' }}
        >
          <TrophyIcon />
          Top Raiser
        </div>
      )}

      <div className="flex flex-col flex-1 p-5 sm:p-6">

        {/* Club name */}
        <h2 className="text-lg sm:text-xl font-black text-dreamxec-navy uppercase tracking-tight leading-snug pr-20 group-hover:text-dreamxec-orange transition-colors duration-150">
          {club.name}
        </h2>

        {/* College */}
        <div className="flex items-center gap-1.5 mt-2.5">
          <span style={{ color: acc.statText }}><BuildingIcon /></span>
          <p className="text-xs font-black text-dreamxec-navy/70 uppercase tracking-wider leading-tight truncate">
            {club.college}
          </p>
        </div>

        {/* Hard divider */}
        <div className="my-4" style={{ borderTop: '2px dashed #000080', opacity: 0.15 }} />

        {/* Description */}
        {club.description && (
          <p className="text-xs sm:text-sm text-dreamxec-navy/60 font-medium leading-relaxed mb-4 line-clamp-2">
            {club.description}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2.5 mt-auto">
          <div
            className="flex flex-col gap-1 p-3"
            style={{ border: `2px solid ${acc.statBorder}`, background: acc.statBg }}
          >
            <div className="flex items-center gap-1" style={{ color: acc.statText }}>
              <CampaignIcon />
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Campaigns</span>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-dreamxec-navy leading-none">
              {club.totalCampaigns}
            </span>
          </div>

          <div
            className="flex flex-col gap-1 p-3"
            style={{ border: '2px solid #FF7F00', background: '#fff7ed' }}
          >
            <div className="flex items-center gap-1 text-dreamxec-orange">
              <FundsIcon />
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Raised</span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-dreamxec-navy leading-none">
              {raisedDisplay}
            </span>
          </div>
        </div>

        {/* CTA row */}
        <div
          className="mt-4 flex items-center justify-between px-3 py-2 bg-white group-hover:bg-dreamxec-navy transition-colors duration-150"
          style={{ border: '2px solid #000080' }}
        >
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-dreamxec-navy group-hover:text-white transition-colors">
            View Club
          </span>
          <span className="font-black text-dreamxec-navy group-hover:text-white transition-all group-hover:translate-x-1 duration-150">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   SKELETON CARD
───────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white animate-pulse" style={{ border: '3px solid #000080', boxShadow: '6px 6px 0 #e5e7eb' }}>
      <div className="h-2 bg-gray-200" />
      <div className="p-5 sm:p-6 space-y-4">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <div className="h-16 bg-gray-100 rounded" />
          <div className="h-16 bg-orange-50 rounded" />
        </div>
        <div className="h-8 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function ClubDiscovery() {
  const [clubs, setClubs] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [loading, setLoading] = useState(false);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const res = await getPublicClubs({ page, limit: 6, search: searchQuery, sort: sortBy });
      if (res.success) { setClubs(res.data ?? []); setMeta(res.meta ?? null); }
    } catch (err) {
      console.error("Fetch Clubs Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClubs(); }, [page, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-dreamxec-cream">

      {/* Decorative shapes */}
      <div className="fixed top-24 left-6 opacity-10 pointer-events-none">
        <div className="w-14 h-14 border-4 border-dreamxec-orange rotate-12" />
      </div>
      <div className="fixed top-1/2 right-8 opacity-10 pointer-events-none">
        <div className="w-10 h-10 bg-dreamxec-green rotate-45" />
      </div>
      <div className="fixed bottom-32 left-1/4 opacity-8 pointer-events-none">
        <div className="w-6 h-6 bg-dreamxec-navy" />
      </div>

      {/* ── HERO ── */}
      <div className="relative bg-dreamxec-navy overflow-hidden" style={{ borderBottom: '5px solid #FF7F00' }}>

        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Tricolor corner tag */}
        <div className="absolute top-0 right-0 flex flex-col w-3 h-full">
          <div className="flex-1 bg-[#FF7F00]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#0B9C2C]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 md:py-20">

          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-dreamxec-navy"
            style={{ background: '#FF7F00', border: '2px solid #fff' }}
          >
            <span>★</span> DreamXec Network
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-none mb-4">
            Explore{" "}
            <span
              className="inline-block px-2 sm:px-3"
              style={{ background: '#FF7F00', color: '#000080' }}
            >
              College
            </span>{" "}
            Clubs
          </h1>

          <p className="text-white/60 text-sm sm:text-base md:text-lg font-bold max-w-xl leading-relaxed">
            Discover innovation hubs raising funds on DreamXec — support the next generation of ideas.
          </p>

          {/* Stats strip */}
          {meta && (
            <div className="mt-8 flex flex-wrap gap-3">
              <div
                className="flex items-center gap-3 px-4 py-2.5"
                style={{ border: '2px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.08)' }}
              >
                <span className="text-2xl sm:text-3xl font-black text-dreamxec-orange">{meta.total}</span>
                <span className="text-xs sm:text-sm font-black text-white/60 uppercase tracking-widest">Registered Clubs</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── CONTROLS ── */}
      <div
        className="sticky top-0 z-30 bg-dreamxec-cream"
        style={{ borderBottom: '3px solid #000080', boxShadow: '0 3px 0 #FF7F00' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">

            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dreamxec-navy/50 pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search clubs or colleges..."
                value={searchQuery}
                onChange={(e) => { setPage(1); setSearchQuery(e.target.value); }}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm font-bold text-dreamxec-navy bg-white placeholder:text-dreamxec-navy/40 focus:outline-none transition-all"
                style={{ border: '3px solid #000080', boxShadow: '3px 3px 0 #FF7F00' }}
              />
            </div>

            {/* Sort */}
            <div className="relative sm:w-52">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dreamxec-navy/50 pointer-events-none">
                <SortIcon />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full pl-9 pr-8 py-2.5 sm:py-3 text-sm font-bold text-dreamxec-navy bg-white focus:outline-none appearance-none cursor-pointer transition-all"
                style={{ border: '3px solid #000080', boxShadow: '3px 3px 0 #0B9C2C' }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-dreamxec-navy/50">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 md:py-12">

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>

        ) : clubs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 sm:py-28 text-center">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-5 bg-white"
              style={{ border: '3px solid #000080', boxShadow: '5px 5px 0 #FF7F00' }}
            >
              <span className="text-3xl">🔍</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-dreamxec-navy uppercase tracking-tight mb-2">
              No Clubs Found
            </h2>
            <p className="text-sm sm:text-base text-dreamxec-navy/50 font-bold max-w-xs">
              Try adjusting your search filters or check back later.
            </p>
          </div>

        ) : (
          <>
            {/* Results count */}
            <div className="flex items-center gap-3 mb-7 sm:mb-8 md:mb-10">
              <span className="text-xs font-black text-dreamxec-navy/50 uppercase tracking-widest">Showing</span>
              <span
                className="px-3 py-1.5 text-xs sm:text-sm font-black text-white uppercase tracking-wide"
                style={{ background: '#FF7F00', border: '2px solid #000080' }}
              >
                {meta?.total} Club{meta?.total !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
              {clubs.map((club, index) => (
                <ClubCard key={club.id} club={club} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {meta?.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 sm:gap-3 mt-14 sm:mt-16 md:mt-20">

                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 font-black text-xs sm:text-sm uppercase tracking-wide transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:translate-x-[-1px] hover:translate-y-[-1px]"
                  style={{ border: '3px solid #000080', background: '#fff', boxShadow: '3px 3px 0 #000080', color: '#000080' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 18l-6-6 6-6" /></svg>
                  Prev
                </button>

                {/* Page pills */}
                <div className="flex items-center gap-1.5">
                  {[...Array(meta.totalPages)].map((_, i) => {
                    const p = i + 1;
                    const isCurrent = p === page;
                    const isNear = Math.abs(p - page) <= 1 || p === 1 || p === meta.totalPages;
                    if (!isNear) return (p === 2 || p === meta.totalPages - 1)
                      ? <span key={p} className="text-dreamxec-navy/30 font-black text-sm px-0.5">…</span>
                      : null;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className="w-9 h-9 sm:w-10 sm:h-10 font-black text-sm transition-all"
                        style={{
                          border: '3px solid #000080',
                          background: isCurrent ? '#000080' : '#fff',
                          color: isCurrent ? '#fff' : '#000080',
                          boxShadow: isCurrent ? '3px 3px 0 #FF7F00' : '2px 2px 0 #000080',
                          transform: isCurrent ? 'translate(-1px,-1px)' : 'none',
                        }}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={page === meta.totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 font-black text-xs sm:text-sm uppercase tracking-wide transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:translate-x-[-1px] hover:translate-y-[-1px]"
                  style={{ border: '3px solid #000080', background: '#fff', boxShadow: '3px 3px 0 #000080', color: '#000080' }}
                >
                  Next
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <FooterContent />
    </div>
  );
}