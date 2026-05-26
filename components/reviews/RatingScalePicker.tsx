'use client';

import { motion } from 'framer-motion';
import { Star, Utensils, ChefHat } from 'lucide-react';

export type RatingIconType = 'star' | 'utensils' | 'taste';

interface RatingScalePickerProps {
  iconType: RatingIconType;
  value: number;
  hoverValue: number;
  onHover: (value: number) => void;
  onLeave: () => void;
  onSelect: (value: number) => void;
  size?: 'lg' | 'md';
}

function RatingIcon({
  type,
  filled,
  size,
}: {
  type: RatingIconType;
  filled: boolean;
  size: 'lg' | 'md';
}) {
  const className = `${size === 'lg' ? 'w-10 h-10 md:w-12 md:h-12' : 'w-8 h-8'} transition-colors duration-150 ${
    filled
      ? type === 'star'
        ? 'text-yellow-400 fill-yellow-400'
        : type === 'utensils'
          ? 'text-primary-600'
          : 'text-amber-600'
      : 'text-gray-300'
  }`;

  if (type === 'star') {
    return <Star className={className} strokeWidth={filled ? 0 : 1.5} />;
  }
  if (type === 'utensils') {
    return <Utensils className={className} strokeWidth={filled ? 2.5 : 1.5} />;
  }
  return <ChefHat className={className} strokeWidth={filled ? 2.5 : 1.5} />;
}

export function RatingScalePicker({
  iconType,
  value,
  hoverValue,
  onHover,
  onLeave,
  onSelect,
  size = 'lg',
}: RatingScalePickerProps) {
  const activeLevel = hoverValue || value;

  return (
    <div
      className="flex items-center justify-center gap-2 md:gap-3"
      onMouseLeave={onLeave}
      role="group"
      aria-label="Rate from 1 to 5"
    >
      {[1, 2, 3, 4, 5].map((level) => {
        const filled = level <= activeLevel;
        return (
          <motion.button
            key={level}
            type="button"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => onHover(level)}
            onClick={() => onSelect(level)}
            className="p-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
            aria-label={`Rate ${level} out of 5`}
          >
            <RatingIcon type={iconType} filled={filled} size={size} />
          </motion.button>
        );
      })}
    </div>
  );
}
