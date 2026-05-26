'use client';

import Link from 'next/link';
import { Product } from '@/lib/types';
import { getSmallBusinessSpotlight, getSpotlightReason, isHiddenGem } from '@/lib/local-boost';
import { HiddenGemBadge } from '@/components/HiddenGemBadge';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Star, TrendingUp, ArrowRight, Sparkles, Store } from 'lucide-react';

interface SmallBusinessSpotlightProps {
  products: Product[];
}

export function SmallBusinessSpotlight({ products }: SmallBusinessSpotlightProps) {
  const spotlightProducts = getSmallBusinessSpotlight(products, 3);

  if (spotlightProducts.length === 0) {
    return null;
  }

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <section className="py-14 md:py-16 px-4 bg-gradient-to-b from-amber-50/90 to-white -mt-1">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Small Business Spotlight
            </h2>
          </div>
          <p className="text-gray-600 max-w-xl mx-auto">
            Discover local F&B products that compete strongly with big chains based on value.
          </p>
        </div>

        {/* Spotlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {spotlightProducts.map((product) => {
            const bestValueScore = product.best_value_score || 0;
            const reviewCount = product.review_count || 0;
            const reason = getSpotlightReason(product);
            const hiddenGem = isHiddenGem(product);

            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:border-primary-200 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">{product.seller_name}</p>
                  </div>
                  {hiddenGem && <HiddenGemBadge product={product} size="sm" />}
                </div>

                {/* Price & Score */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-primary-600">
                    {formatCurrency(product.price)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Score: {bestValueScore}
                    </Badge>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3 text-sm">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium text-gray-900">
                    {product.average_rating?.toFixed(1)}
                  </span>
                  <span className="text-gray-500">({reviewCount * 10} reviews)</span>
                </div>

                {/* Why Featured */}
                <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                  <p className="text-sm text-amber-800">
                    <span className="font-medium">Why featured:</span> {reason}
                  </p>
                </div>

                {/* Hover CTA */}
                <div className="mt-4 flex items-center text-primary-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  View Product
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/leaderboard">
            <Button variant="outline" size="lg">
              <Store className="w-4 h-4 mr-2" />
              View Local Leaderboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
