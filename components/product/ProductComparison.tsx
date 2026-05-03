'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatPrice, formatRating } from '@/lib/utils/formatters';
import { Star, Check, X } from 'lucide-react';

interface ProductComparisonProps {
  products: Product[];
}

export function ProductComparison({ products }: ProductComparisonProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Select products to compare</p>
      </div>
    );
  }

  const bestValueProduct = products.reduce((best, current) => {
    return (current.best_value_score || 0) > (best.best_value_score || 0) ? current : best;
  }, products[0]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left p-4 bg-gray-50 font-semibold text-gray-700">Feature</th>
            {products.map((product) => (
              <th key={product.id} className="p-4 bg-gray-50 text-center min-w-[200px]">
                <div className="font-semibold text-gray-900">{product.name}</div>
                <div className="text-sm text-gray-500">{product.seller_name}</div>
                {product.id === bestValueProduct.id && (
                  <Badge variant="success" className="mt-2">Best Value</Badge>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-4 font-medium text-gray-700">Price</td>
            {products.map((product) => {
              const isLowestPrice = product.price === Math.min(...products.map(p => p.price));
              return (
                <td key={product.id} className="p-4 text-center">
                  <span className={`text-lg font-bold ${isLowestPrice ? 'text-success-600' : 'text-gray-900'}`}>
                    {formatPrice(product.price, product.currency)}
                  </span>
                  {isLowestPrice && <Badge variant="success" className="ml-2">Lowest</Badge>}
                </td>
              );
            })}
          </tr>
          <tr className="border-b">
            <td className="p-4 font-medium text-gray-700">Rating</td>
            {products.map((product) => {
              const isHighestRating = product.average_rating === Math.max(...products.map(p => p.average_rating));
              return (
                <td key={product.id} className="p-4 text-center">
                  <div className="flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className={`ml-1 font-semibold ${isHighestRating ? 'text-success-600' : 'text-gray-900'}`}>
                      {formatRating(product.average_rating)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">({product.review_count} reviews)</span>
                </td>
              );
            })}
          </tr>
          <tr className="border-b">
            <td className="p-4 font-medium text-gray-700">Best Value Score</td>
            {products.map((product) => {
              const isBest = product.id === bestValueProduct.id;
              return (
                <td key={product.id} className="p-4 text-center">
                  <span className={`text-lg font-bold ${isBest ? 'text-success-600' : 'text-gray-900'}`}>
                    {((product.best_value_score || 0) * 100).toFixed(0)}/100
                  </span>
                  {isBest && <Badge variant="success" className="ml-2">Winner</Badge>}
                </td>
              );
            })}
          </tr>
          <tr className="border-b">
            <td className="p-4 font-medium text-gray-700">Portion Score</td>
            {products.map((product) => (
              <td key={product.id} className="p-4 text-center">
                <span className="font-semibold text-gray-900">{product.portion_score}/5</span>
              </td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="p-4 font-medium text-gray-700">Taste Score</td>
            {products.map((product) => (
              <td key={product.id} className="p-4 text-center">
                <span className="font-semibold text-gray-900">{product.taste_score}/5</span>
              </td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="p-4 font-medium text-gray-700">Halal</td>
            {products.map((product) => (
              <td key={product.id} className="p-4 text-center">
                {product.is_halal ? (
                  <Check className="w-5 h-5 text-success-600 mx-auto" />
                ) : (
                  <X className="w-5 h-5 text-gray-400 mx-auto" />
                )}
              </td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="p-4 font-medium text-gray-700">Offers</td>
            {products.map((product) => (
              <td key={product.id} className="p-4 text-center">
                {product.offers.length > 0 ? (
                  <div className="space-y-1">
                    {product.offers.map((offer) => (
                      <Badge key={offer.id} variant="primary">{offer.title}</Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
