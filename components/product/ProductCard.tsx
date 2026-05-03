'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Product } from '@/lib/types';
import { formatPrice, formatRating } from '@/lib/utils/formatters';
import { Star, MapPin } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  showBestValue?: boolean;
  rank?: number;
}

export function ProductCard({ product, showBestValue = true, rank }: ProductCardProps) {
  const isBestValue = showBestValue && (product.best_value_score || 0) >= 0.7;

  return (
    <Link href={`/product/${product.id}`}>
      <Card hover className="h-full">
        <CardBody className="p-4">
          {/* Image placeholder */}
          <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-gray-400 text-sm">{product.name}</span>
          </div>

          {/* Best Value Badge */}
          {isBestValue && (
            <Badge variant="success" className="mb-2">
              Best Value #{rank || 1}
            </Badge>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
            {product.name}
          </h3>

          {/* Seller */}
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            {product.seller_name}
          </div>

          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center mr-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 font-medium text-gray-900">
                {formatRating(product.average_rating)}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              ({product.review_count} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary-600">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.offers.length > 0 && (
              <Badge variant="primary">
                {product.offers[0].title}
              </Badge>
            )}
          </div>

          {/* Categories */}
          <div className="mt-3 flex flex-wrap gap-1">
            {product.categories.slice(0, 3).map((cat) => (
              <Badge key={cat} variant="default">
                {cat.replace(/_/g, ' ')}
              </Badge>
            ))}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
