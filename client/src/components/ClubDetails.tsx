import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicClubBySlug } from "../services/clubService";
import CampaignCard from "./CampaignCard";
import { FooterContent } from "../sections/Footer/components/FooterContent";
import { StarDecoration } from "./icons/StarDecoration";

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

            const res = await getPublicClubBySlug(slug, {
                page,
                limit: 6,
            });

            if (res.success) {
                setClub(res.data ?? null);
                setMeta(res.meta ?? null);
            }
        } catch (err) {
            console.error("Club fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClub();
    }, [slug, page]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dreamxec-cream">
                <div className="w-20 h-20 border-4 border-dreamxec-orange/30 border-t-dreamxec-orange rounded-full animate-spin" />
            </div>
        );
    }

    if (!club) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dreamxec-cream">
                <h1 className="text-3xl font-bold text-dreamxec-navy">
                    Club not found
                </h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dreamxec-cream">

            {/* HERO SECTION */}
            <section className="relative bg-gradient-to-r from-dreamxec-navy to-dreamxec-berkeley-blue border-b-8 border-dreamxec-orange shadow-2xl">
                <div className="max-w-7xl mx-auto px-6 py-20">

                    <div className="flex items-start gap-6 mb-6">
                        <h1 className="text-5xl lg:text-6xl font-black text-dreamxec-orange font-display">
                            {club.name}
                        </h1>
                        <StarDecoration className="w-14 h-14 mt-3" color="#FF7F00" />
                    </div>

                    <p className="text-dreamxec-cream text-2xl font-semibold">
                        {club.college}
                    </p>

                    {club.description && (
                        <p className="mt-6 text-dreamxec-cream/90 text-lg max-w-3xl">
                            {club.description}
                        </p>
                    )}
                </div>
            </section>

            {/* STATS BAR */}
            <section className="max-w-7xl mx-auto px-6 py-16">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">

                    <div className="bg-white border-2 border-dreamxec-navy rounded-3xl p-10 shadow-2xl text-center">
                        <div className="text-4xl font-black text-dreamxec-orange">
                            {club.totalCampaigns}
                        </div>
                        <div className="text-lg font-bold text-dreamxec-navy mt-2">
                            Active Campaigns
                        </div>
                    </div>

                    <div className="bg-white border-2 border-dreamxec-navy rounded-3xl p-10 shadow-2xl text-center">
                        <div className="text-4xl font-black text-dreamxec-orange">
                            ₹{club.totalRaised?.toLocaleString()}
                        </div>
                        <div className="text-lg font-bold text-dreamxec-navy mt-2">
                            Total Raised
                        </div>
                    </div>

                    <div className="bg-white border-2 border-dreamxec-navy rounded-3xl p-10 shadow-2xl text-center">
                        <div className="text-4xl font-black text-dreamxec-orange">
                            {meta?.total || club.campaigns.length}
                        </div>
                        <div className="text-lg font-bold text-dreamxec-navy mt-2">
                            Showing Campaigns
                        </div>
                    </div>

                </div>

                {/* CAMPAIGNS GRID */}
                {club.campaigns.length === 0 ? (
                    <div className="text-center text-2xl font-bold text-dreamxec-navy">
                        No campaigns available yet.
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-20">
                            {club.campaigns.map((campaign: any) => (
                                <CampaignCard
                                    key={campaign.id}
                                    campaign={{
                                        ...campaign,
                                        currentAmount: campaign.amountRaised ?? 0,
                                    }}
                                    href={`/campaign/${campaign.id}`}
                                />
                            ))}
                        </div>

                        {/* PAGINATION */}
                        {meta?.totalPages > 1 && (
                            <div className="flex justify-center gap-6 mt-10">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage((prev) => prev - 1)}
                                    className="px-8 py-4 border-4 border-dreamxec-navy rounded-2xl font-bold disabled:opacity-40"
                                >
                                    ← Prev
                                </button>

                                <span className="text-2xl font-bold text-dreamxec-navy">
                                    Page {meta.page} of {meta.totalPages}
                                </span>

                                <button
                                    disabled={page === meta.totalPages}
                                    onClick={() => setPage((prev) => prev + 1)}
                                    className="px-8 py-4 border-4 border-dreamxec-navy rounded-2xl font-bold disabled:opacity-40"
                                >
                                    Next →
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
