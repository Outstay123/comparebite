'use client';

import { useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ThumbsUp, MinusCircle, AlertTriangle } from 'lucide-react';
import { VALUE_FEEDBACK_OPTIONS, ValueFeedbackOption } from '@/components/reviews/types';

interface ValueFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (option: ValueFeedbackOption) => void;
}

const OPTION_ICONS: Record<string, ReactNode> = {
  excellent: <Star className="w-5 h-5 text-amber-500" />,
  worth_it: <ThumbsUp className="w-5 h-5 text-primary-600" />,
  slightly_expensive: <MinusCircle className="w-5 h-5 text-amber-600" />,
  overpriced: <AlertTriangle className="w-5 h-5 text-gray-600" />,
};

export function ValueFeedbackModal({ isOpen, onClose, onSelect }: ValueFeedbackModalProps) {
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
            aria-labelledby="value-feedback-title"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto"
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
              <h2 id="value-feedback-title" className="text-2xl font-bold text-gray-900 pr-8">
                How was the value?
              </h2>
              <p className="text-gray-600 mt-2 mb-6">
                Help others understand whether this item is worth the price.
              </p>

              <div className="flex flex-col gap-3">
                {VALUE_FEEDBACK_OPTIONS.map((option) => (
                  <motion.button
                    key={option.id}
                    type="button"
                    whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(220, 38, 38, 0.12)' }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => onSelect(option)}
                    className="group w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/50 text-left transition-colors duration-200"
                  >
                    <div className="flex-shrink-0 p-2.5 rounded-lg bg-gray-50 group-hover:bg-primary-100 transition-colors">
                      {OPTION_ICONS[option.id]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-500 mt-0.5">{option.description}</div>
                    </div>
                    <span className="flex-shrink-0 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-bold">
                      +{option.score}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
