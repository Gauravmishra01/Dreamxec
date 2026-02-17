import React, { useEffect } from 'react';
import type { User } from '../types';

interface DonateModalProps {
    show: boolean;
    onClose: () => void;
    donationAmount: string;
    setDonationAmount: (amount: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    currentUser: User | null;
    email: string;
    setEmail: (email: string) => void;
}

export default function DonateModal({
    show,
    onClose,
    donationAmount,
    setDonationAmount,
    onSubmit,
    currentUser,
    email,
    setEmail,
}: DonateModalProps) {

    // Lock body scroll when modal is open
    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [show]);

    if (!show) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-dreamxec-navy/80 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Alignment Container */}
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                {/* Modal Panel */}
                <div
                    className="relative transform overflow-hidden card-pastel-offwhite rounded-lg sm:rounded-xl border-3 sm:border-2 md:border-5 border-dreamxec-navy shadow-pastel-card text-left transition-all sm:my-8 sm:w-full sm:max-w-lg p-4 sm:p-5 md:p-8 w-full max-w-md mx-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="card-tricolor-tag"></div>

                    <h2
                        id="modal-title"
                        className="text-xl sm:text-2xl md:text-3xl font-bold text-dreamxec-navy mb-3 sm:mb-4 md:mb-6 font-display mt-1 sm:mt-2 md:mt-4 break-words"
                    >
                        Support This Campaign
                    </h2>

                    <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
                        {/* Amount field */}
                        <div>
                            <label className="block text-sm sm:text-base md:text-lg font-bold text-dreamxec-navy mb-1.5 sm:mb-2 md:mb-3 font-display">
                                Donation Amount (₹)
                            </label>
                            <input
                                type="number"
                                value={donationAmount}
                                onChange={(e) => setDonationAmount(e.target.value)}
                                placeholder="Enter amount"
                                min="1"
                                step="1"
                                required
                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border-3 sm:border-2 border-dreamxec-navy rounded-md sm:rounded-lg text-base sm:text-lg md:text-xl font-sans text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-green focus:ring-2 focus:ring-dreamxec-green transition-all"
                            />
                        </div>

                        {/* Email field for guests */}
                        {!currentUser && (
                            <div>
                                <label className="block text-sm sm:text-base md:text-lg font-bold text-dreamxec-navy mb-1.5 sm:mb-2 md:mb-3 font-display">
                                    Email:
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border-3 sm:border-2 border-dreamxec-navy rounded-md sm:rounded-lg text-base sm:text-lg md:text-xl font-sans text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-green focus:ring-2 focus:ring-dreamxec-green transition-all"
                                    required
                                    placeholder="Enter email"
                                />
                            </div>
                        )}

                        {/* Quick amounts */}
                        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                            {[100, 500, 1000, 5000].map((amount) => (
                                <button
                                    key={amount}
                                    type="button"
                                    onClick={() => setDonationAmount(amount.toString())}
                                    className="px-2 sm:px-3 py-1.5 sm:py-2 bg-dreamxec-cream text-dreamxec-navy rounded-md sm:rounded-lg border-2 sm:border-3 border-dreamxec-orange font-bold font-display hover:bg-dreamxec-orange hover:text-white transition-all text-xs sm:text-sm whitespace-nowrap"
                                >
                                    ₹{amount}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-2 sm:gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gray-300 text-dreamxec-navy rounded-md sm:rounded-lg border-3 sm:border-2 border-dreamxec-navy font-bold font-display hover:scale-105 transition-transform text-xs sm:text-sm md:text-base"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!donationAmount || (!currentUser && !email)}
                                className="flex-1 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-dreamxec-green text-white rounded-md sm:rounded-lg border-3 sm:border-2 border-dreamxec-navy font-bold font-display hover:scale-105 transition-transform shadow-pastel-green disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm md:text-base"
                            >
                                Donate Now
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
