'use client';

import { useCallback, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { ReviewMeUpButton } from '@/components/reviews/ReviewMeUpButton';
import { ReviewFlowData } from '@/components/reviews/ReviewFlowModal';

const ReviewFlowModal = dynamic(
  () =>
    import('@/components/reviews/ReviewFlowModal').then((m) => ({
      default: m.ReviewFlowModal,
    })),
  { ssr: false }
);

const ThankYouOverlay = dynamic(
  () =>
    import('@/components/reviews/ThankYouOverlay').then((m) => ({
      default: m.ThankYouOverlay,
    })),
  { ssr: false }
);

type FlowStep = 'idle' | 'flow' | 'thanks';

interface ProductReviewFlowProps {
  productId: string;
}

export function ProductReviewFlow({ productId }: ProductReviewFlowProps) {
  const [step, setStep] = useState<FlowStep>('idle');
  const feedbackRef = useRef<ReviewFlowData | null>(null);

  const handleOpen = () => setStep('flow');

  const handleClose = useCallback(() => {
    setStep('idle');
    feedbackRef.current = null;
  }, []);

  const handleFlowComplete = useCallback((data: ReviewFlowData) => {
    feedbackRef.current = data;
    setStep('thanks');
  }, []);

  const handleThankYouComplete = useCallback(() => {
    setStep('idle');
    feedbackRef.current = null;
  }, []);

  return (
    <>
      <ReviewMeUpButton onClick={handleOpen} />

      {step === 'flow' && (
        <ReviewFlowModal
          isOpen
          productId={productId}
          onClose={handleClose}
          onComplete={handleFlowComplete}
        />
      )}

      {step === 'thanks' && (
        <ThankYouOverlay isOpen onComplete={handleThankYouComplete} />
      )}
    </>
  );
}
