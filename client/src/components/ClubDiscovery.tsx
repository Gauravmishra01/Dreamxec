import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicClubs } from "../services/clubService";
import { StarDecoration } from "./icons/StarDecoration";
import { FooterContent } from "../sections/Footer/components/FooterContent";

type SortOption = "newest" | "oldest";

// Trophy icon inline SVG for top-performing clubs
const TrophyIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 5h-2V3H7v2H5C3.9 5 3 5.9 3 7v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V18H7v2h10v-2h-4v-2.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
    </svg>
);

// Building icon for college
const BuildingIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.7L19 12v7H5v-7l7-6.3z M10 17v-3h4v3h-4z"/>
    </svg>
);

// Campaign icon
const CampaignIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zm-8-3l-3-4-2 2.5 3 4 2-2.5zM11 9.5c0 .83.67 1.5 1.5 1.5S14 10.33 14 9.5 13.33 8 12.5 8 11 8.67 11 9.5z"/>
    </svg>
);

// Rupee / funds icon
const FundsIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c4.86-2.34 8-7 8-11.5C20 5.81 16.19 2 11.5 2zm1 14.5h-2v-2h2v2zm0-4h-2c0-3.25 3-3 3-5 0-1.1-.9-2-2-2s-2 .9-2 2h-2c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.5-3 2.75-3 5z"/>
    </svg>
);

// Search icon
const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
);

// Sort icon
const SortIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M7 12h10M11 18h2"/>
    </svg>
);

function ClubCard({ club, index }: { club: any; index: number }) {
    const isTopRaiser = club.totalRaised > 100000;
    const progressPercent = Math.min((club.totalRaised / 200000) * 100, 100);

    // Assign subtle accent colors per card for variety
    const accentColors = [
        { bg: "bg-dreamxec-orange", text: "text-dreamxec-orange", ring: "ring-dreamxec-orange/20", tag: "bg-orange-50" },
        { bg: "bg-dreamxec-orange",  text: "text-dreamxec-green",  ring: "ring-dreamxec-green/20",  tag: "bg-green-50"  },
        { bg: "bg-dreamxec-orange",   text: "text-dreamxec-navy",   ring: "ring-dreamxec-navy/20",   tag: "bg-blue-50"   },
    ];
    const accent = accentColors[index % 3];

    return (
        <Link
            to={`/clubs/${club.slug}`}
            className="group relative flex flex-col bg-white rounded-2xl border-2 border-dreamxec-navy/10 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-400 overflow-hidden"
            style={{ animationDelay: `${index * 60}ms` }}
        >
            {/* Top accent strip */}
            <div className={`h-1.5 w-full ${accent.bg}`} />

            {/* Top-right badge for top raisers */}
            {isTopRaiser && (
                <div className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-amber-900 text-xs font-bold rounded-full shadow-md z-10">
                    <TrophyIcon />
                    Top Raiser
                </div>
            )}

            <div className="flex flex-col flex-1 p-7">

                {/* Club name */}
                <h2 className="text-xl font-black text-dreamxec-navy font-display leading-snug pr-24 group-hover:text-dreamxec-orange transition-colors duration-200">
                    {club.name}
                </h2>

                {/* College name — bold, prominent */}
                <div className="flex items-center gap-2 mt-3">
                    <span className={`${accent.text} flex-shrink-0`}>
                        <BuildingIcon />
                    </span>
                    <p className="text-sm font-bold text-dreamxec-navy/80 uppercase tracking-wide leading-tight">
                        {club.college}
                    </p>
                </div>

                {/* Divider */}
                <div className="my-5 h-px bg-dreamxec-navy/8" />

                {/* Description — if available */}
                {club.description && (
                    <p className="text-sm text-dreamxec-navy/60 leading-relaxed mb-5 line-clamp-2">
                        {club.description}
                    </p>
                )}

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-3 mt-auto">

                    {/* Campaigns stat */}
                    <div className={`flex flex-col gap-1 rounded-xl px-4 py-3 ${accent.tag} border border-dreamxec-navy/8`}>
                        <div className={`flex items-center gap-1.5 ${accent.text} font-semibold text-xs uppercase tracking-wider`}>
                            <CampaignIcon />
                            Campaigns
                        </div>
                        <span className="text-2xl font-black text-dreamxec-navy">
                            {club.totalCampaigns}
                        </span>
                    </div>

                    {/* Raised stat */}
                    <div className="flex flex-col gap-1 rounded-xl px-4 py-3 bg-dreamxec-orange/8 border border-dreamxec-orange/15">
                        <div className="flex items-center gap-1.5 text-dreamxec-orange font-semibold text-xs uppercase tracking-wider">
                            <FundsIcon />
                            Total Raised
                        </div>
                        <span className="text-2xl font-black text-dreamxec-navy">
                            ₹{club.totalRaised >= 100000
                                ? `${(club.totalRaised / 100000).toFixed(1)}L`
                                : club.totalRaised.toLocaleString("en-IN")}
                        </span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mt-5">
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[11px] font-semibold text-dreamxec-navy/50 uppercase tracking-wider">Fundraising Progress</span>
                        <span className={`text-[11px] font-bold ${accent.text}`}>{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-dreamxec-navy/8 overflow-hidden">
                        <div
                            className={`h-full rounded-full ${accent.bg} transition-all duration-700`}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                {/* CTA footer */}
                <div className={`mt-6 flex items-center justify-between text-xs font-bold ${accent.text} group-hover:gap-2 transition-all`}>
                    <span className="uppercase tracking-wider">View Club</span>
                    <span className="translate-x-0 group-hover:translate-x-1 transition-transform duration-200">→</span>
                </div>
            </div>
        </Link>
    );
}

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
            const res = await getPublicClubs({
                page,
                limit: 6,
                search: searchQuery,
                sort: sortBy,
            });
            if (res.success) {
                setClubs(res.data ?? []);
                setMeta(res.meta ?? null);
            }
        } catch (err) {
            console.error("Fetch Clubs Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClubs();
    }, [page, searchQuery, sortBy]);

    return (
        <div className="min-h-screen bg-dreamxec-cream">

            {/* Ambient background decorations */}
            <div className="fixed top-24 left-6 opacity-[0.07] pointer-events-none select-none">
                <StarDecoration className="w-16 h-16" color="#FF7F00" />
            </div>
            <div className="fixed top-1/2 right-10 opacity-[0.06] pointer-events-none select-none">
                <StarDecoration className="w-12 h-12" color="#0B9C2C" />
            </div>
            <div className="fixed bottom-32 left-1/4 opacity-[0.05] pointer-events-none select-none">
                <StarDecoration className="w-20 h-20" color="#0B2560" />
            </div>

            {/* ─── HERO HEADER ─── */}
            <div className="relative bg-gradient-to-br from-dreamxec-navy via-dreamxec-berkeley-blue to-[#0a1e4a] border-b-[6px] border-dreamxec-orange overflow-hidden">

                {/* Decorative grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                        backgroundSize: "48px 48px"
                    }}
                />

                {/* Glowing orb accent */}
                <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-dreamxec-orange/10 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-64 h-32 rounded-full bg-dreamxec-green/10 blur-2xl pointer-events-none" />

                {/* Corner tricolor tag */}
                <div className="card-tricolor-tag absolute top-0 right-0 z-10" />

                <div className="relative max-w-7xl mx-auto px-6 sm:px-10 py-14 sm:py-20">

                    {/* Eyebrow label */}
                    

                    <div className="flex items-start gap-4 mb-4">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-display leading-tight tracking-tight">
                            Explore{" "}
                            <span className="text-dreamxec-orange">College</span>{" "}
                            Clubs
                        </h1>
                        
                    </div>

                    <p className="text-dreamxec-cream/75 text-lg sm:text-xl font-medium max-w-xl leading-relaxed">
                        Discover innovation hubs raising funds on DreamXec — support the next generation of ideas.
                    </p>

                    {/* Quick stats strip */}
                    {meta && (
                        <div className="mt-10 flex flex-wrap gap-4">
                            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm">
                                <span className="text-2xl font-black text-dreamxec-orange">{meta.total}</span>
                                <span className="text-sm font-semibold text-dreamxec-cream/70">Registered Clubs</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ─── CONTROLS ─── */}
            <div className="sticky top-0 z-30 bg-dreamxec-cream/90 backdrop-blur-md border-b border-dreamxec-navy/10 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 py-4">
                    <div className="flex flex-col sm:flex-row gap-3">

                        {/* Search */}
                        <div className="relative flex-1">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-dreamxec-navy/40 pointer-events-none">
                                <SearchIcon />
                            </div>
                            <input
                                type="text"
                                placeholder="Search clubs or colleges..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setPage(1);
                                    setSearchQuery(e.target.value);
                                }}
                                className="w-full pl-12 pr-5 py-3.5 border-2 border-dreamxec-navy/15 rounded-xl text-base font-semibold text-dreamxec-navy bg-white placeholder:text-dreamxec-navy/35 focus:outline-none focus:border-dreamxec-orange focus:ring-4 focus:ring-dreamxec-orange/15 transition-all duration-200 shadow-sm"
                            />
                        </div>

                        {/* Sort */}
                        <div className="relative sm:w-56">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-dreamxec-navy/40 pointer-events-none">
                                <SortIcon />
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                                className="w-full pl-11 pr-5 py-3.5 border-2 border-dreamxec-navy/15 rounded-xl text-base font-semibold text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-green focus:ring-4 focus:ring-dreamxec-green/15 transition-all duration-200 appearance-none shadow-sm cursor-pointer"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                            {/* Custom chevron */}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-dreamxec-navy/40">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── MAIN CONTENT ─── */}
            <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12">

                {loading ? (
                    /* ── Skeleton loading ── */
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border-2 border-dreamxec-navy/8 overflow-hidden animate-pulse">
                                <div className="h-1.5 bg-dreamxec-navy/10" />
                                <div className="p-7 space-y-4">
                                    <div className="h-5 bg-dreamxec-navy/10 rounded-lg w-3/4" />
                                    <div className="h-3.5 bg-dreamxec-navy/8 rounded w-1/2" />
                                    <div className="h-px bg-dreamxec-navy/8 my-5" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="h-20 bg-dreamxec-navy/6 rounded-xl" />
                                        <div className="h-20 bg-dreamxec-orange/6 rounded-xl" />
                                    </div>
                                    <div className="h-2 bg-dreamxec-navy/8 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>

                ) : clubs.length === 0 ? (
                    /* ── Empty state ── */
                    <div className="flex flex-col items-center justify-center py-28 text-center">
                        <div className="w-20 h-20 rounded-2xl bg-dreamxec-orange/10 flex items-center justify-center mb-6">
                            <StarDecoration className="w-10 h-10" color="#FF7F00" />
                        </div>
                        <h2 className="text-3xl font-black text-dreamxec-navy font-display mb-3">
                            No Clubs Found
                        </h2>
                        <p className="text-lg text-dreamxec-navy/50 font-medium max-w-sm">
                            Try adjusting your search filters or check back later.
                        </p>
                    </div>

                ) : (
                    <>
                        {/* ── Results header ── */}
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-dreamxec-navy/50 uppercase tracking-widest">Showing</span>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-dreamxec-orange text-white rounded-lg font-black text-sm shadow-sm">
                                    {meta?.total} club{meta?.total !== 1 ? "s" : ""}
                                </div>
                            </div>
                        </div>

                        {/* ── Club Grid ── */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {clubs.map((club, index) => (
                                <ClubCard key={club.id} club={club} index={index} />
                            ))}
                        </div>

                        {/* ── Pagination ── */}
                        {meta?.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-20">

                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage((prev) => prev - 1)}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-dreamxec-navy/20 bg-white text-dreamxec-navy font-bold text-sm hover:border-dreamxec-navy hover:bg-dreamxec-navy hover:text-white disabled:opacity-35 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                                    Prev
                                </button>

                                {/* Page pills */}
                                <div className="flex items-center gap-2">
                                    {[...Array(meta.totalPages)].map((_, i) => {
                                        const p = i + 1;
                                        const isCurrent = p === page;
                                        const isNear = Math.abs(p - page) <= 1 || p === 1 || p === meta.totalPages;
                                        if (!isNear) return p === 2 || p === meta.totalPages - 1
                                            ? <span key={p} className="text-dreamxec-navy/30 font-bold text-sm px-1">…</span>
                                            : null;
                                        return (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`w-10 h-10 rounded-lg text-sm font-bold transition-all duration-200 ${
                                                    isCurrent
                                                        ? "bg-dreamxec-orange text-white shadow-md scale-110"
                                                        : "bg-white border-2 border-dreamxec-navy/15 text-dreamxec-navy hover:border-dreamxec-navy/40"
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    disabled={page === meta.totalPages}
                                    onClick={() => setPage((prev) => prev + 1)}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-dreamxec-navy/20 bg-white text-dreamxec-navy font-bold text-sm hover:border-dreamxec-navy hover:bg-dreamxec-navy hover:text-white disabled:opacity-35 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                                >
                                    Next
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
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