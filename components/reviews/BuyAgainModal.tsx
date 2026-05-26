'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ThumbsUp, ThumbsDown } from 'lucide-react';

interface BuyAgainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (wouldBuyAgain: boolean) => void;
}

export function BuyAgainModal({ isOpen, onClose, onSelect }: BuyAgainModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            aria-label="Close modal"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="buy-again-title"
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[520px]"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 md:p-8">
              <h2 id="buy-again-title" className="text-2xl font-bold text-gray-900 pr-8">
                Would you buy this again?
              </h2>
              <p className="text-gray-600 mt-2 mb-8">
                This helps improve recommendation confidence.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  type="button"
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(true)}
                  className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-success-200 bg-success-50 hover:bg-success-100 hover:border-success-400 transition-colors"
                >
                  <ThumbsUp className="w-8 h-8 text-success-600" />
                  <span className="text-lg font-bold text-success-700">YES</span>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(false)}
                  className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-colors"
                >
                  <ThumbsDown className="w-8 h-8 text-gray-600" />
                  <span className="text-lg font-bold text-gray-700">NO</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
