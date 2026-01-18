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
    // 📳 Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(20);
    }
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
          {/* Soft fade */}
          
          <div className="px-4 pb-3 pt-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleClick}
              className="
                w-full
                bg-dreamxec-green
                text-white
                rounded-lg
                border-2 border-dreamxec-navy
                shadow-pastel-green
                px-4 py-3
                flex flex-col gap-2
                font-display
                focus:outline-none
              "
            >
              {/* Text Row */}
              <div className="flex items-center justify-between w-full text-sm font-bold">
                <span> {label}</span>
                <span className="font-sans text-xs opacity-90">
                  ₹{remaining.toLocaleString()} left
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-white/40 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
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
