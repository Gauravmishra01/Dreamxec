import { motion, AnimatePresence } from 'framer-motion';

interface MobileDonateCTAProps {
  visible: boolean;
  onDonateClick: () => void;
  currentAmount: number;
  goalAmount: number;
  label?: string;
}

export default function MobileDonateCTA({
  visible,
  onDonateClick,
  currentAmount,
  goalAmount,
  label = 'Support this Campaign',
}: MobileDonateCTAProps) {
  const handleClick = () => {
    if (navigator.vibrate) navigator.vibrate(20);
    onDonateClick();
  };

  const progress = Math.min((currentAmount / goalAmount) * 100, 100);
  const remaining = Math.max(goalAmount - currentAmount, 0);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 24 }}
          className="fixed bottom-0 left-0 right-0 z-[9998] md:hidden"
        >
          {/* Subtle white-to-transparent fade above */}
          <div
            className="h-6 w-full pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.9))' }}
          />

          {/* CTA container */}
          <div
            className="mx-3 mb-3 bg-white overflow-hidden"
            style={{
              border: '3px solid #000080',
              boxShadow: '4px 4px 0 #FF7F00',
              borderRadius: '12px',
            }}
          >
          

            <motion.button
              whileTap={{ scale: 0.98, x: 2, y: 2 }}
              onClick={handleClick}
              className="w-full px-4 py-3 flex flex-col gap-2.5 focus:outline-none"
            >
              {/* Text row */}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-dreamxec-orange flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span className="text-xs font-black text-dreamxec-navy uppercase tracking-widest">
                    {label}
                  </span>
                </div>

                <span
                  className="text-[10px] font-black text-dreamxec-navy px-2 py-0.5 flex-shrink-0"
                  style={{ border: '2px solid #FF7F00', background: '#fff7ed', color: '#c2410c' }}
                >
                  ₹{remaining.toLocaleString()} left
                </span>
              </div>

              {/* Progress bar — flat, hard bordered */}
              <div
                className="w-full h-2.5 overflow-hidden"
                style={{ border: '2px solid #000080', background: '#f3f4f6', borderRadius: '6px' }}
              >
                <motion.div
                  className="h-full"
                  style={{ background: '#FF7F00' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}