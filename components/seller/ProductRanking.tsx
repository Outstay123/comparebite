'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Product } from '@/lib/types';
import { formatPrice, formatRating } from '@/lib/utils/formatters';
import { Star, TrendingUp, TrendingDown, Award } from 'lucide-react';

interface ProductRankingProps {
  title: string;
  products: Product[];
  type: 'top_rated' | 'worst_rated' | 'best_value';
}

export function ProductRanking({ title, products, type }: ProductRankingProps) {
  const icons = {
    top_rated: Star,
    worst_rated: TrendingDown,
    best_value: Award,
  };

  const Icon = icons[type];

  return (
    <Card>
      <CardHeader className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-primary-600" />
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </CardHeader>
      <CardBody className="p-0">
        {products.length === 0 ? (
          <p className="p-4 text-gray-500 text-center">No products found</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {products.map((product, index) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-semibold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-sm text-gray-500 truncate">{product.seller_name}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium">{formatRating(product.average_rating)}</span>
                  </div>
                  <p className="text-sm text-primary-600 font-medium">
                    {formatPrice(product.price, product.currency)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
