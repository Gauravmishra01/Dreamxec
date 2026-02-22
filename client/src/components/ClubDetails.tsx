import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicClubBySlug } from "../services/clubService";
import CampaignCard from "./CampaignCard";
import { FooterContent } from "../sections/Footer/components/FooterContent";

export default function ClubDetails() {
  const { slug } = useParams();
  const [club, setClub] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchClub = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      const res = await getPublicClubBySlug(slug, { page, limit: 6 });
      if (res.success) { setClub(res.data ?? null); setMeta(res.meta ?? null); }
    } catch (err) {
      console.error("Club fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClub(); }, [slug, page]);

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-dreamxec-cream">
      <div
        className="p-8 text-center bg-white"
        style={{ border: '4px solid #003366', boxShadow: '8px 8px 0 #FF7F00' }}
      >
        <div className="w-10 h-10 border-4 border-dreamxec-navy border-t-dreamxec-orange rounded-full animate-spin mx-auto mb-3" />
        <p className="font-black uppercase tracking-widest text-dreamxec-navy text-xs">Loading club...</p>
      </div>
    </div>
  );

  /* ── Not found ── */
  if (!club) return (
    <div className="min-h-screen flex items-center justify-center bg-dreamxec-cream px-4">
      <div
        className="p-8 text-center bg-white max-w-sm w-full"
        style={{ border: '4px solid #003366', boxShadow: '8px 8px 0 #FF7F00' }}
      >
        <p className="text-4xl mb-3">🏛️</p>
        <h1 className="text-2xl font-black text-dreamxec-navy uppercase tracking-tight">Club Not Found</h1>
        <p className="text-dreamxec-navy/50 font-bold text-sm mt-2">This club doesn't exist or has been removed.</p>
      </div>
    </div>
  );

  const raisedDisplay = club.totalRaised >= 100000
    ? `₹${(club.totalRaised / 100000).toFixed(1)}L`
    : `₹${club.totalRaised?.toLocaleString("en-IN") ?? "0"}`;

  return (
    <div className="min-h-screen bg-dreamxec-cream">

      {/* ════════════════════════════════
          HERO — College name is the star
      ════════════════════════════════ */}
      <section className="relative bg-dreamxec-navy overflow-hidden" style={{ borderBottom: '5px solid #FF7F00' }}>

        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Left tricolor stripe */}
        <div className="absolute top-0 left-0 flex flex-col h-full w-2.5">
          <div className="flex-1 bg-[#FF7F00]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#0B9C2C]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16 md:py-20 pl-8 sm:pl-10 lg:pl-14">

          {/* ── COLLEGE NAME — HERO CENTERPIECE ── */}
          <div className="mb-6 sm:mb-8">

            {/* Label stamp */}
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-dreamxec-navy"
              style={{ background: '#FF7F00', border: '2px solid #fff' }}
            >
              🏛️ Institution
            </div>

            {/* College name — largest, most prominent */}
            <div className="relative">
              {/* Shadow layer for depth */}
              <h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none select-none pointer-events-none absolute"
                style={{
                  color: 'transparent',
                  WebkitTextStroke: '2px rgba(255,127,0,0.3)',
                  top: '4px',
                  left: '4px',
                }}
                aria-hidden
              >
                {club.college}
              </h2>

              {/* Actual college name */}
              <h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none relative z-10"
                style={{
                  color: 'transparent',
                  WebkitTextStroke: '2px #FF7F00',
                  paintOrder: 'stroke fill',
                }}
              >
                {/* Highlighted first word differently */}
                {club.college.split(" ").map((word: string, i: number, arr: string[]) => (
                  <span
                    key={i}
                    className={i === 0 ? "relative" : ""}
                  >
                    {i === 0 ? (
                      <span
                        className="relative inline-block px-1 sm:px-2"
                        style={{
                          background: '#FF7F00',
                          color: '#003366',
                          WebkitTextStroke: '0px',
                          marginRight: '0.2em',
                        }}
                      >
                        {word}
                      </span>
                    ) : (
                      <span style={{ color: '#fff', WebkitTextStroke: '0px' }}>
                        {word}{i < arr.length - 1 ? ' ' : ''}
                      </span>
                    )}
                  </span>
                ))}
              </h2>
            </div>
          </div>

          {/* Divider rule */}
          <div className="flex items-center gap-3 mb-5 sm:mb-6">
            <div className="h-0.5 w-8 bg-dreamxec-orange" />
            <div className="h-0.5 flex-1 bg-white/10" />
          </div>

          {/* ── Club name — secondary ── */}
          <div className="flex items-start gap-3 flex-wrap mb-4 sm:mb-5">
            <div
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5"
              style={{ border: '3px solid #fff', background: 'rgba(255,255,255,0.08)' }}
            >
              <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Club</span>
              <span className="text-base sm:text-lg md:text-xl font-black text-white uppercase tracking-tight">
                {club.name}
              </span>
            </div>
          </div>

          {/* Description */}
          {club.description && (
            <p className="text-white/60 text-sm sm:text-base font-bold max-w-2xl leading-relaxed">
              {club.description}
            </p>
          )}
        </div>
      </section>

      {/* ════════════════════════════════
          STATS BAR
      ════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 sm:pt-10 md:pt-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5">

          {[
            { value: club.totalCampaigns, label: 'Active Campaigns', emoji: '📢', accent: '#FF7F00' },
            { value: raisedDisplay, label: 'Total Raised', emoji: '💰', accent: '#0B9C2C' },
            { value: meta?.total || club.campaigns.length, label: 'Campaigns Listed', emoji: '📋', accent: '#003366' },
          ].map(({ value, label, emoji, accent }, i) => (
            <div
              key={i}
              className="bg-white flex items-center gap-3 sm:flex-col sm:items-start p-4 sm:p-5 md:p-6 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
              style={{ border: '3px solid #003366', boxShadow: `5px 5px 0 ${accent}` }}
            >
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 text-xl sm:text-2xl"
                style={{ border: '2px solid #003366', background: `${accent}18` }}
              >
                {emoji}
              </div>
              <div>
                <div
                  className="text-2xl sm:text-3xl md:text-4xl font-black leading-none"
                  style={{ color: accent }}
                >
                  {value}
                </div>
                <div className="text-xs font-black text-dreamxec-navy/60 uppercase tracking-widest mt-1">
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════
          CAMPAIGNS
      ════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 md:py-12">

        {/* Section heading */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <span className="inline-block w-2 h-7 bg-dreamxec-orange" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-black text-dreamxec-navy uppercase tracking-tight">
            Campaigns
          </h3>
          {meta?.total > 0 && (
            <span
              className="px-2.5 py-1 text-xs font-black text-white uppercase tracking-wide"
              style={{ background: '#003366', border: '2px solid #003366' }}
            >
              {meta.total}
            </span>
          )}
        </div>

        {club.campaigns.length === 0 ? (
          <div
            className="py-16 text-center bg-white"
            style={{ border: '3px dashed #003366' }}
          >
            <p className="text-3xl mb-3">📭</p>
            <p className="font-black text-dreamxec-navy/50 uppercase tracking-widest text-sm">
              No campaigns available yet
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 md:gap-8 mb-10 sm:mb-12 md:mb-16">
              {club.campaigns.map((campaign: any) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={{ ...campaign, currentAmount: campaign.amountRaised ?? 0 }}
                  href={`/campaign/${campaign.id}`}
                />
              ))}
            </div>

            {/* Pagination */}
            {meta?.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 font-black text-xs sm:text-sm uppercase tracking-wide transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:translate-x-[-1px] hover:translate-y-[-1px]"
                  style={{ border: '3px solid #003366', background: '#fff', boxShadow: '3px 3px 0 #003366', color: '#003366' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 18l-6-6 6-6" /></svg>
                  Prev
                </button>

                <div
                  className="px-4 py-2 font-black text-sm"
                  style={{ border: '3px solid #003366', background: '#003366', color: '#fff', boxShadow: '3px 3px 0 #FF7F00' }}
                >
                  {meta.page} <span className="text-white/40">/</span> {meta.totalPages}
                </div>

                <button
                  disabled={page === meta.totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 font-black text-xs sm:text-sm uppercase tracking-wide transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:translate-x-[-1px] hover:translate-y-[-1px]"
                  style={{ border: '3px solid #003366', background: '#fff', boxShadow: '3px 3px 0 #003366', color: '#003366' }}
                >
                  Next
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <FooterContent />
    </div>
  );
}