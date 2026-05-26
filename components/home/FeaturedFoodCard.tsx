'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils/formatters';
import { Badge } from '@/components/ui/Badge';
import {
  Utensils,
  Coffee,
  CupSoda,
  Beef,
  Drumstick,
  Soup,
  Sandwich,
  Pizza,
  TrendingUp,
} from 'lucide-react';

interface FeaturedFoodCardProps {
  product: Product;
  sellerType: 'local' | 'chain';
  isActive?: boolean;
}

function FoodPlaceholder({ category }: { category: string }) {
  const getCategoryStyle = (cat: string) => {
    const styles: Record<string, { bg: string; icon: React.ReactNode }> = {
      chicken_chop: { bg: 'bg-orange-100', icon: <Drumstick className="w-10 h-10 text-orange-500" /> },
      fried_chicken: { bg: 'bg-yellow-100', icon: <Drumstick className="w-10 h-10 text-yellow-600" /> },
      burger: { bg: 'bg-amber-100', icon: <Beef className="w-10 h-10 text-amber-600" /> },
      nasi_lemak: { bg: 'bg-green-100', icon: <Utensils className="w-10 h-10 text-green-600" /> },
      coffee: { bg: 'bg-amber-100', icon: <Coffee className="w-10 h-10 text-amber-700" /> },
      milk_tea: { bg: 'bg-purple-100', icon: <CupSoda className="w-10 h-10 text-purple-600" /> },
      matcha: { bg: 'bg-green-100', icon: <CupSoda className="w-10 h-10 text-green-600" /> },
      laksa: { bg: 'bg-red-100', icon: <Soup className="w-10 h-10 text-red-500" /> },
      pizza: { bg: 'bg-yellow-50', icon: <Pizza className="w-10 h-10 text-yellow-600" /> },
      sandwich: { bg: 'bg-yellow-50', icon: <Sandwich className="w-10 h-10 text-yellow-600" /> },
    };

    for (const key of Object.keys(styles)) {
      if (cat.toLowerCase().includes(key)) return styles[key];
    }
    return { bg: 'bg-gray-100', icon: <Utensils className="w-10 h-10 text-gray-500" /> };
  };

  const style = getCategoryStyle(category);
  return (
    <div className={`w-full h-full flex items-center justify-center ${style.bg}`}>
      {style.icon}
    </div>
  );
}

export function FeaturedFoodCard({ product, sellerType, isActive = false }: FeaturedFoodCardProps) {
  const primaryCategory = product.categories[0] || 'food';
  const score = product.best_value_score || 0;
  const isBestValue = score >= 0.7;

  return (
    <Link
      href={`/product/${product.id}`}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className={`
        block w-full bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer
        transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isActive
          ? 'shadow-2xl ring-2 ring-white/90'
          : 'shadow-lg hover:shadow-xl'
        }
      `}
    >
      <div
        className={`relative bg-gray-100 transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isActive ? 'h-[11.55rem] md:h-[13.65rem]' : 'h-[9.45rem] md:h-[10.5rem]'
        }`}
      >
        <FoodPlaceholder category={primaryCategory} />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge variant={sellerType === 'local' ? 'warning' : 'primary'} className="text-[10px]">
            {sellerType === 'local' ? 'Local' : 'Chain'}
          </Badge>
          {isBestValue && (
            <Badge variant="success" className="text-[10px]">
              Best Value
            </Badge>
          )}
        </div>
      </div>

      <div className={`${isActive ? 'p-5' : 'p-4'}`}>
        <h3
          className={`font-bold text-gray-900 line-clamp-1 mb-1 ${
            isActive ? 'text-lg md:text-xl' : 'text-base'
          }`}
        >
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-1 mb-3">{product.seller_name}</p>

        <div className="flex items-center justify-between gap-2">
          <span className={`font-bold text-primary-600 ${isActive ? 'text-xl' : 'text-lg'}`}>
            {formatPrice(product.price, product.currency)}
          </span>
          <div className="flex items-center gap-1 text-success-600 bg-success-50 px-2.5 py-1 rounded-full text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            {score.toFixed(2)}
          </div>
        </div>
      </div>
    </Link>
  );
}
