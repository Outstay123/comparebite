'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Product } from '@/lib/types';
import { formatPrice, formatRating } from '@/lib/utils/formatters';
import { Star, MapPin, Utensils, Coffee, CupSoda, Beef, Drumstick, Soup, Sandwich, Pizza } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  showBestValue?: boolean;
  rank?: number;
}

// Inline SVG placeholder component
function FoodPlaceholder({ category, name }: { category: string; name: string }) {
  // Category-based colors and icons
  const getCategoryStyle = (cat: string) => {
    const styles: Record<string, { bg: string; icon: React.ReactNode; label: string }> = {
      'chicken_chop': { bg: 'bg-orange-100', icon: <Drumstick className="w-12 h-12 text-orange-500" />, label: 'Chicken' },
      'fried_chicken': { bg: 'bg-yellow-100', icon: <Drumstick className="w-12 h-12 text-yellow-600" />, label: 'Fried' },
      'burger': { bg: 'bg-amber-100', icon: <Beef className="w-12 h-12 text-amber-600" />, label: 'Burger' },
      'nasi_lemak': { bg: 'bg-green-100', icon: <Utensils className="w-12 h-12 text-green-600" />, label: 'Rice' },
      'nasi_campur': { bg: 'bg-green-100', icon: <Utensils className="w-12 h-12 text-green-600" />, label: 'Rice' },
      'roti_canai': { bg: 'bg-orange-50', icon: <Utensils className="w-12 h-12 text-orange-500" />, label: 'Roti' },
      'char_kuey_teow': { bg: 'bg-stone-100', icon: <Utensils className="w-12 h-12 text-stone-600" />, label: 'Noodles' },
      'mee_goreng': { bg: 'bg-yellow-50', icon: <Utensils className="w-12 h-12 text-yellow-600" />, label: 'Noodles' },
      'laksa': { bg: 'bg-red-100', icon: <Soup className="w-12 h-12 text-red-500" />, label: 'Soup' },
      'satay': { bg: 'bg-amber-50', icon: <Drumstick className="w-12 h-12 text-amber-600" />, label: 'Grill' },
      'ayam_gepuk': { bg: 'bg-orange-100', icon: <Drumstick className="w-12 h-12 text-orange-600" />, label: 'Spicy' },
      'coffee': { bg: 'bg-amber-100', icon: <Coffee className="w-12 h-12 text-amber-700" />, label: 'Coffee' },
      'latte': { bg: 'bg-amber-100', icon: <Coffee className="w-12 h-12 text-amber-700" />, label: 'Latte' },
      'milk_tea': { bg: 'bg-purple-100', icon: <CupSoda className="w-12 h-12 text-purple-600" />, label: 'Tea' },
      'teh_ais': { bg: 'bg-cyan-100', icon: <CupSoda className="w-12 h-12 text-cyan-600" />, label: 'Iced' },
      'teh_tarik': { bg: 'bg-amber-50', icon: <Coffee className="w-12 h-12 text-amber-600" />, label: 'Tea' },
      'matcha': { bg: 'bg-green-100', icon: <CupSoda className="w-12 h-12 text-green-600" />, label: 'Matcha' },
      'pizza': { bg: 'bg-yellow-50', icon: <Pizza className="w-12 h-12 text-yellow-600" />, label: 'Pizza' },
      'sandwich': { bg: 'bg-yellow-50', icon: <Sandwich className="w-12 h-12 text-yellow-600" />, label: 'Sub' },
      'rice_bowl': { bg: 'bg-gray-100', icon: <Utensils className="w-12 h-12 text-gray-600" />, label: 'Bowl' },
    };
    
    for (const c of Object.keys(styles)) {
      if (cat.toLowerCase().includes(c)) return styles[c];
    }
    return { bg: 'bg-gray-100', icon: <Utensils className="w-12 h-12 text-gray-500" />, label: 'Food' };
  };

  const style = getCategoryStyle(category);

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center ${style.bg}`}>
      {style.icon}
      <span className="text-xs text-gray-500 mt-2 font-medium">{style.label}</span>
    </div>
  );
}

export function ProductCard({ product, showBestValue = true, rank }: ProductCardProps) {
  const isBestValue = showBestValue && (product.best_value_score || 0) >= 0.7;
  
  // Get primary category for placeholder
  const primaryCategory = product.categories[0] || 'food';

  return (
    <Link href={`/product/${product.id}`}>
      <Card hover className="h-full">
        <CardBody className="p-0">
          {/* Image Placeholder */}
          <div className="w-full h-44 relative rounded-t-lg overflow-hidden bg-gray-100">
            <FoodPlaceholder category={primaryCategory} name={product.name} />
            
            {/* Overlay badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {isBestValue && (
                <Badge variant="success" className="text-xs">
                  Best Value #{rank || 1}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="p-4">
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
              ({product.review_count * 10} reviews)
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
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
