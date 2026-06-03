'use client';

import Link from 'next/link';
import { Product } from '@/lib/types';
import { ProductList } from '@/components/product/ProductList';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

interface HomeCategorySectionProps {
  title: string;
  description?: string;
  products: Product[];
  viewMoreLink: string;
  viewMoreLabel?: string;
  badge?: 'local' | 'chain' | 'hidden_gem' | 'under_10' | 'drink' | 'nearby';
  maxProducts?: number;
}

export function HomeCategorySection({
  title,
  description,
  products,
  viewMoreLink,
  viewMoreLabel = 'View More',
  badge,
  maxProducts = 4,
}: HomeCategorySectionProps) {
  const displayProducts = products.slice(0, maxProducts);

  const getBadgeStyle = () => {
    switch (badge) {
      case 'local':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'chain':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'hidden_gem':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'under_10':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'drink':
        return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'nearby':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getBadgeLabel = () => {
    switch (badge) {
      case 'local':
        return 'Local';
      case 'chain':
        return 'Chain';
      case 'hidden_gem':
        return 'Hidden Gem';
      case 'under_10':
        return 'Under RM10';
      case 'drink':
        return 'Drink';
      case 'nearby':
        return 'Nearby';
      default:
        return '';
    }
  };

  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-6 md:py-8 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-4 md:mb-6">
          <div>
            <div className="flex items-center gap-2 md:gap-3 mb-1">
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">{title}</h2>
              {badge && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getBadgeStyle()}`}>
                  {getBadgeLabel()}
                </span>
              )}
            </div>
            {description && (
              <p className="text-gray-600 text-xs md:text-sm">{description}</p>
            )}
          </div>
          <Link href={viewMoreLink}>
            <Button variant="outline" size="sm">
              {viewMoreLabel}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Product Grid */}
        <ProductList products={displayProducts} />
      </div>
    </section>
  );
}
