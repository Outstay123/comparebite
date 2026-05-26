'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ThumbsUp, ThumbsDown, Star, MinusCircle, AlertTriangle } from 'lucide-react';
import { VALUE_FEEDBACK_OPTIONS, ValueFeedbackOption } from '@/components/reviews/types';
import { RatingScalePicker } from '@/components/reviews/RatingScalePicker';

export interface ReviewFlowData {
  productId: string;
  starRating: number;
  valueScore: number;
  portion: number;
  taste: number;
  buyAgain: boolean;
}

interface ReviewFlowModalProps {
  isOpen: boolean;
  productId: string;
  onClose: () => void;
  onComplete: (data: ReviewFlowData) => void;
}

type InternalStep = 'stars' | 'value' | 'portion' | 'taste' | 'buyAgain';

const STEP_ORDER: InternalStep[] = ['stars', 'value', 'portion', 'taste', 'buyAgain'];

const STEP_LABELS: Record<InternalStep, string> = {
  stars: 'Overall',
  value: 'Value',
  portion: 'Portion',
  taste: 'Taste',
  buyAgain: 'Buy Again',
};

const OPTION_ICONS: Record<string, ReactNode> = {
  excellent: <Star className="w-5 h-5 text-amber-500" />,
  worth_it: <ThumbsUp className="w-5 h-5 text-primary-600" />,
  slightly_expensive: <MinusCircle className="w-5 h-5 text-amber-600" />,
  overpriced: <AlertTriangle className="w-5 h-5 text-gray-600" />,
};

const slideTransition = {
  duration: 0.48,
  ease: [0.16, 1, 0.3, 1] as const,
};

export function ReviewFlowModal({ isOpen, productId, onClose, onComplete }: ReviewFlowModalProps) {
  const [step, setStep] = useState<InternalStep>('stars');
  const [direction, setDirection] = useState(1);
  const [hoverRating, setHoverRating] = useState(0);
  const [data, setData] = useState<Omit<ReviewFlowData, 'productId' | 'buyAgain'>>({
    starRating: 0,
    valueScore: 0,
    portion: 0,
    taste: 0,
  });

  const stepIndex = STEP_ORDER.indexOf(step);

  const reset = useCallback(() => {
    setStep('stars');
    setDirection(1);
    setHoverRating(0);
    setData({ starRating: 0, valueScore: 0, portion: 0, taste: 0 });
  }, []);

  useEffect(() => {
    if (!isOpen) {
      reset();
      return;
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, reset]);

  const goToStep = (next: InternalStep) => {
    const nextIndex = STEP_ORDER.indexOf(next);
    setDirection(nextIndex > stepIndex ? 1 : -1);
    setStep(next);
    setHoverRating(0);
  };

  const advance = (next: InternalStep) => {
    setTimeout(() => goToStep(next), 180);
  };

  const handleStarSelect = (rating: number) => {
    setData((prev) => ({ ...prev, starRating: rating }));
    advance('value');
  };

  const handleValueSelect = (option: ValueFeedbackOption) => {
    setData((prev) => ({ ...prev, valueScore: option.score }));
    advance('portion');
  };

  const handlePortionSelect = (portion: number) => {
    setData((prev) => ({ ...prev, portion }));
    advance('taste');
  };

  const handleTasteSelect = (taste: number) => {
    setData((prev) => ({ ...prev, taste }));
    advance('buyAgain');
  };

  const handleBuyAgain = (buyAgain: boolean) => {
    onComplete({
      productId,
      ...data,
      buyAgain,
    });
  };

  if (!isOpen) return null;

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '55%' : '-55%',
      opacity: 0,
      scale: 0.9,
      zIndex: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      zIndex: 10,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-35%' : '35%',
      opacity: 0,
      scale: 0.94,
      zIndex: 0,
    }),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Close modal"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[520px] overflow-hidden"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors z-20"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step progress */}
        <div className="flex items-center justify-center gap-1.5 pt-5 px-6">
          {STEP_ORDER.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= stepIndex ? 'w-6 bg-primary-500' : 'w-3 bg-gray-200'
              }`}
              title={STEP_LABELS[s]}
            />
          ))}
        </div>

        <div className="relative min-h-[340px] md:min-h-[360px] overflow-hidden px-6 md:px-8 pt-4 pb-8">
          <AnimatePresence mode="popLayout" custom={direction}>
            {step === 'stars' && (
              <motion.div
                key="stars"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
                className="absolute inset-x-6 md:inset-x-8 top-4 bottom-8 flex flex-col"
              >
                <h2 className="text-2xl font-bold text-gray-900 pr-8">How would you rate it?</h2>
                <p className="text-gray-600 mt-2 mb-10">Tap a star from 1 to 5.</p>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <RatingScalePicker
                    iconType="star"
                    value={data.starRating}
                    hoverValue={hoverRating}
                    onHover={setHoverRating}
                    onLeave={() => setHoverRating(0)}
                    onSelect={handleStarSelect}
                  />
                  {(hoverRating || data.starRating) > 0 && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 text-sm font-medium text-gray-500"
                    >
                      {hoverRating || data.starRating} / 5
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )}

            {step === 'value' && (
              <motion.div
                key="value"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
                className="absolute inset-x-6 md:inset-x-8 top-4 bottom-8 flex flex-col"
              >
                <h2 className="text-2xl font-bold text-gray-900 pr-8">How was the value?</h2>
                <p className="text-gray-600 mt-2 mb-4 text-sm">
                  Help others understand whether this item is worth the price.
                </p>
                <div className="grid grid-cols-2 gap-2.5 flex-1 content-center">
                  {VALUE_FEEDBACK_OPTIONS.map((option) => (
                    <motion.button
                      key={option.id}
                      type="button"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleValueSelect(option)}
                      className="group flex flex-col gap-2 p-3 rounded-xl border-2 border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/50 text-left transition-colors h-full min-h-[118px]"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-primary-100 transition-colors">
                          {OPTION_ICONS[option.id]}
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold">
                          +{option.score}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm leading-tight">
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-2 leading-snug">
                          {option.description}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'portion' && (
              <motion.div
                key="portion"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
                className="absolute inset-x-6 md:inset-x-8 top-4 bottom-8 flex flex-col"
              >
                <h2 className="text-2xl font-bold text-gray-900 pr-8">How was the portion?</h2>
                <p className="text-gray-600 mt-2 mb-10">Rate the serving size from 1 to 5.</p>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <RatingScalePicker
                    iconType="utensils"
                    value={data.portion}
                    hoverValue={hoverRating}
                    onHover={setHoverRating}
                    onLeave={() => setHoverRating(0)}
                    onSelect={handlePortionSelect}
                  />
                  {(hoverRating || data.portion) > 0 && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 text-sm font-medium text-gray-500"
                    >
                      {hoverRating || data.portion} / 5
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )}

            {step === 'taste' && (
              <motion.div
                key="taste"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
                className="absolute inset-x-6 md:inset-x-8 top-4 bottom-8 flex flex-col"
              >
                <h2 className="text-2xl font-bold text-gray-900 pr-8">How was the taste?</h2>
                <p className="text-gray-600 mt-2 mb-10">Rate the flavor from 1 to 5.</p>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <RatingScalePicker
                    iconType="taste"
                    value={data.taste}
                    hoverValue={hoverRating}
                    onHover={setHoverRating}
                    onLeave={() => setHoverRating(0)}
                    onSelect={handleTasteSelect}
                  />
                  {(hoverRating || data.taste) > 0 && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 text-sm font-medium text-gray-500"
                    >
                      {hoverRating || data.taste} / 5
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )}

            {step === 'buyAgain' && (
              <motion.div
                key="buyAgain"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
                className="absolute inset-x-6 md:inset-x-8 top-4 bottom-8 flex flex-col"
              >
                <h2 className="text-2xl font-bold text-gray-900 pr-8">Would you buy this again?</h2>
                <p className="text-gray-600 mt-2 mb-8">
                  This helps improve recommendation confidence.
                </p>
                <div className="grid grid-cols-2 gap-4 flex-1 content-center">
                  <motion.button
                    type="button"
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleBuyAgain(true)}
                    className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-success-200 bg-success-50 hover:bg-success-100 hover:border-success-400 transition-colors"
                  >
                    <ThumbsUp className="w-8 h-8 text-success-600" />
                    <span className="text-lg font-bold text-success-700">YES</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleBuyAgain(false)}
                    className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-colors"
                  >
                    <ThumbsDown className="w-8 h-8 text-gray-600" />
                    <span className="text-lg font-bold text-gray-700">NO</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
