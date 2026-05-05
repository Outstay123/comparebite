'use client';

import { Sparkles } from 'lucide-react';
import { isHiddenGem } from '@/lib/local-boost';
import { Product } from '@/lib/types';

interface HiddenGemBadgeProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function HiddenGemBadge({
  product,
  size = 'md',
  showLabel = true,
}: HiddenGemBadgeProps) {
  if (!isHiddenGem(product)) {
    return null;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200 ${sizeClasses[size]}`}
      title="High-value local option that deserves more visibility"
    >
      <Sparkles className={`${iconSizes[size]} text-amber-600`} />
      {showLabel && <span>Hidden Gem</span>}
    </span>
  );
}
