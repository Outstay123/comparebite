'use client';

import Link from 'next/link';
import { Product } from '@/lib/types';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatPrice, formatRating } from '@/lib/utils/formatters';
import { Star, MapPin, TrendingUp, ArrowRightLeft } from 'lucide-react';

interface FeaturedNearbyCardProps {
  product: Product;
  compareHref: string;
}

export function FeaturedNearbyCard({ product, compareHref }: FeaturedNearbyCardProps) {
  const score = product.best_value_score || 0;

  return (
    <Card className="h-full overflow-hidden">
      <CardBody className="p-0 flex flex-col h-full">
        <Link href={`/product/${product.id}`} className="block flex-1">
          <div className="h-48 md:h-52 bg-gray-100 relative overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                {product.name}
              </div>
            )}
            <div className="absolute top-3 left-3">
              <Badge variant="primary" className="text-xs">
                Recommended
              </Badge>
            </div>
          </div>
          <div className="p-5">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{product.name}</h3>
            <div className="flex items-center text-sm text-gray-600 mt-1 mb-3">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{product.seller_name}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xl font-bold text-primary-600">
                {formatPrice(product.price, product.currency)}
              </span>
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1 text-success-600 font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  {(score * 100).toFixed(0)}
                </span>
                <span className="flex items-center gap-1 text-gray-700">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  {formatRating(product.average_rating)}
                </span>
              </div>
            </div>
          </div>
        </Link>
        <div className="px-5 pb-5 pt-0">
          <Link href={compareHref}>
            <Button variant="outline" size="sm" className="w-full">
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              Compare
            </Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
