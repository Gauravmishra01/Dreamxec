import { useState } from 'react';
import { subscribeToNewsletter } from '../services/newsletterService';

interface NewsletterModalProps {
    isOpen: boolean;
    onClose: () => void;
    source?: string;
}

export const NewsletterModal = ({ isOpen, onClose, source = 'navbar_modal' }: NewsletterModalProps) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            await subscribeToNewsletter(email, source);
            setStatus('success');
            setMessage('Thank you for subscribing!');
            setEmail('');
            // Auto-close after success (optional)
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setMessage('');
            }, 2000);
        } catch (error: any) {
            console.error(error);
            setStatus('error');
            setMessage(error.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border-4 border-dreamxec-navy overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-dreamxec-navy/50 hover:text-dreamxec-orange transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="p-8">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-dreamxec-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-dreamxec-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-dreamxec-navy font-display mb-2">
                            Stay in the Loop
                        </h3>
                        <p className="text-dreamxec-navy/70">
                            Get the latest updates on student innovations and funding opportunities.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-dreamxec-navy/20 focus:border-dreamxec-orange focus:outline-none transition-colors text-dreamxec-navy placeholder-dreamxec-navy/40"
                            />
                        </div>

                        {status === 'error' && (
                            <p className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">{message}</p>
                        )}

                        {status === 'success' && (
                            <p className="text-green-600 text-sm text-center font-medium bg-green-50 py-2 rounded-lg">{message}</p>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'loading' || status === 'success'}
                            className="w-full py-3 bg-dreamxec-orange disabled:bg-gray-400 text-white font-bold rounded-xl shadow-md hover:translate-y-[-2px] hover:shadow-lg transition-all duration-200 font-display"
                        >
                            {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe Now'}
                        </button>
                    </form>

                    <p className="mt-4 text-xs text-center text-dreamxec-navy/50">
                        No spam, just dreams. Unsubscribe anytime.
                    </p>
                </div>
            </div>
        </div>
    );
};
