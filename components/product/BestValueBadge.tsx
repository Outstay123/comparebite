'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Trophy } from 'lucide-react';

interface BestValueBadgeProps {
  score: number;
  rank?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function BestValueBadge({ score, rank, size = 'md' }: BestValueBadgeProps) {
  const sizeStyles = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 bg-success-50 text-success-600 rounded-full font-semibold ${sizeStyles[size]}`}>
      <Trophy className="w-4 h-4" />
      <span>Best Value</span>
      {rank && <span>#{rank}</span>}
      <span className="ml-1 text-success-700">({(score * 100).toFixed(0)}%)</span>
    </div>
  );
}
