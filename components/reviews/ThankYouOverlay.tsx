'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface ThankYouOverlayProps {
  isOpen: boolean;
  onComplete: () => void;
}

const VISIBLE_MS = 2800;
const FADE_OUT_MS = 1400;
const PARTICLE_COUNT = 32;

const fadeEase = [0.16, 1, 0.3, 1] as const;

export function ThankYouOverlay({ isOpen, onComplete }: ThankYouOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setVisible(false);
      return;
    }

    setVisible(true);
    document.body.style.overflow = 'hidden';

    const fadeTimer = setTimeout(() => {
      setVisible(false);
    }, VISIBLE_MS);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, VISIBLE_MS + FADE_OUT_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
      document.body.style.overflow = '';
    };
  }, [isOpen, onComplete]);

  if (!mounted) return null;

  const overlay = (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key="thank-you-overlay"
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ width: '100vw', height: '100dvh', top: 0, left: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_OUT_MS / 1000, ease: fadeEase }}
        >
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            style={{ width: '100vw', height: '100dvh' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: FADE_OUT_MS / 1000, ease: fadeEase }}
          />

          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              width: '100vw',
              height: '100dvh',
              background:
                'radial-gradient(circle at 50% 45%, rgba(251, 191, 36, 0.4) 0%, rgba(220, 38, 38, 0.25) 35%, transparent 65%)',
            }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.08 }}
            transition={{
              duration: FADE_OUT_MS / 1000,
              ease: fadeEase,
            }}
          />

          {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
            const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
            const distance = 100 + (i % 6) * 32;
            return (
              <motion.div
                key={i}
                className="absolute w-2.5 h-2.5 rounded-full pointer-events-none"
                style={{
                  background: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#ef4444' : '#fcd34d',
                  left: '50%',
                  top: '45%',
                }}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0.9, 0.4],
                  scale: [0, 1.3, 0.9, 0.6],
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance,
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  duration: 2.2,
                  delay: i * 0.04,
                  ease: 'easeOut',
                }}
              />
            );
          })}

          <motion.div
            className="relative text-center px-6 z-10"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -16 }}
            transition={{
              duration: FADE_OUT_MS / 1000,
              ease: fadeEase,
            }}
          >
            <motion.h2
              className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-lg"
              style={{
                textShadow:
                  '0 0 40px rgba(251, 191, 36, 0.85), 0 0 90px rgba(220, 38, 38, 0.55), 0 2px 8px rgba(0,0,0,0.35)',
              }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 1.2, repeat: 1, repeatType: 'reverse', ease: 'easeInOut' }}
            >
              THANK YOU
            </motion.h2>
            <motion.p
              className="mt-5 text-lg md:text-xl text-white/95 max-w-md mx-auto font-medium"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: FADE_OUT_MS / 1000, ease: fadeEase }}
            >
              Your feedback helps others make smarter food decisions.
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(overlay, document.body);
}
