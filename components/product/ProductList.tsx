'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: Product[];
  showBestValue?: boolean;
}

export function ProductList({ products, showBestValue = true }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:overflow-x-visible gap-4 md:gap-6">
      {products.map((product, index) => (
        <div key={product.id} className="flex-shrink-0 w-[280px] md:w-auto md:flex-shrink snap-start">
          <ProductCard
            product={product}
            showBestValue={showBestValue}
            rank={index + 1}
          />
        </div>
      ))}
    </div>
  );
}
