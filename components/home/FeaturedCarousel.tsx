'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Product } from '@/lib/types';
import { getSellerType } from '@/lib/local-boost';
import { FeaturedFoodCard } from '@/components/home/FeaturedFoodCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FeaturedCarouselProps {
  products: Product[];
}

const AUTO_PLAY_MS = 5500;
const SLIDE_GAP_PERCENT = 78;
const DRAG_THRESHOLD = 50;
const TRANSITION_MS = 950;
const EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';
const VISIBLE_RANGE = 2.15;

export function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPx, setDragPx] = useState(0);
  const dragStartX = useRef<number | null>(null);
  const dragPxRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const count = products.length;

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setCurrent(((index % count) + count) % count);
    },
    [count]
  );

  const goNext = useCallback(() => {
    if (count === 0) return;
    setCurrent((prev) => (prev + 1) % count);
  }, [count]);

  const goPrev = useCallback(() => {
    if (count === 0) return;
    setCurrent((prev) => (prev - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (count <= 1 || isPaused || isDragging) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % count);
    }, AUTO_PLAY_MS);
    return () => clearInterval(timer);
  }, [count, isPaused, isDragging]);

  const getRelativeOffset = (index: number) => {
    let offset = index - current;
    if (offset > count / 2) offset -= count;
    if (offset < -count / 2) offset += count;
    return offset;
  };

  const getDragSlideOffset = () => {
    const width = containerRef.current?.offsetWidth ?? 360;
    return dragPx / (width * 0.42);
  };

  const getSlideStyles = (position: number) => {
    const absPos = Math.abs(position);
    const isActive = absPos < 0.28;

    const scale = isActive
      ? 1
      : Math.max(0.82, 1 - absPos * 0.09);

    const opacity = Math.max(0, Math.min(1, 1.15 - absPos * 0.48));

    const translatePercent = position * SLIDE_GAP_PERCENT;
    const translateY = isActive ? 0 : Math.min(18, 8 + absPos * 10);

    return {
      isActive,
      scale,
      opacity,
      translatePercent,
      translateY,
      zIndex: Math.round(40 - absPos * 12),
      visible: absPos <= VISIBLE_RANGE,
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('a')) return;
    dragStartX.current = e.clientX;
    dragPxRef.current = 0;
    setIsDragging(true);
    setDragPx(0);
    containerRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    dragPxRef.current = delta;
    setDragPx(delta);
  };

  const handlePointerEnd = () => {
    if (dragStartX.current === null) return;
    const delta = dragPxRef.current;
    if (delta > DRAG_THRESHOLD) goPrev();
    else if (delta < -DRAG_THRESHOLD) goNext();
    dragStartX.current = null;
    dragPxRef.current = 0;
    setIsDragging(false);
    setDragPx(0);
  };

  if (products.length === 0) {
    return null;
  }

  const dragSlide = isDragging ? getDragSlideOffset() : 0;
  const transitionStyle = isDragging
    ? 'none'
    : `transform ${TRANSITION_MS}ms ${EASING}, opacity ${TRANSITION_MS}ms ${EASING}`;

  return (
    <div
      className="mt-8 md:mt-10 max-w-5xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative">
        <div
          ref={containerRef}
          className="relative h-[357px] z-10 sm:h-[399px] md:h-[441px] select-none touch-pan-y"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
        >
          {products.map((product, index) => {
            const position = getRelativeOffset(index) + dragSlide;
            const { isActive, scale, opacity, translatePercent, translateY, zIndex, visible } =
              getSlideStyles(position);

            if (!visible) return null;

            return (
              <div
                key={product.id}
                className="absolute top-0 left-1/2 w-[min(92vw,336px)] sm:w-[315px] md:w-[357px] will-change-transform pointer-events-none"
                style={{
                  transform: `translateX(calc(-50% + ${translatePercent}%)) translateY(${translateY}px) scale(${scale})`,
                  opacity,
                  zIndex,
                  transition: transitionStyle,
                }}
              >
                <div className="pointer-events-auto relative">
				{/* Floating Review Scores for Active Slide */}
				{isActive && product.value_score && (
					<div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-white shadow-lg border border-white/10 animate-fade-in">
					<span className="text-amber-400">★ {product.average_rating?.toFixed(1) || '0.0'}</span>
					<span className="text-white/40">|</span>
					<span>Value: {product.value_score} / 5</span>
					<span>Taste: {product.taste_score} / 5</span>
					<span>Portion: {product.portion_score} / 5</span>
					</div>
				)}
                  <FeaturedFoodCard
                    product={product}
                    sellerType={getSellerType(product)}
                    isActive={isActive}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-0 md:-left-3 top-1/2 -translate-y-1/2 z-50 p-2.5 rounded-full bg-white/25 hover:bg-white/40 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 shadow-lg pointer-events-auto"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-0 md:-right-3 top-1/2 -translate-y-1/2 z-50 p-2.5 rounded-full bg-white/25 hover:bg-white/40 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 shadow-lg pointer-events-auto"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {products.map((product, index) => (
            <button
              key={product.id}
              type="button"
              onClick={() => goTo(index)}
              className={`h-2 rounded-full transition-all duration-700 ease-out ${
                index === current ? 'w-7 bg-white shadow-sm' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              style={{ transitionTimingFunction: EASING }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
