'use client';

import { SearchBar } from '@/components/search/SearchBar';
import { ProductList } from '@/components/product/ProductList';
import { loadProducts, enrichProductsWithBestValue, getProductsByChain } from '@/lib/utils/data';
import { getBestValueProducts } from '@/lib/utils/seller';
import { Badge } from '@/components/ui/Badge';
import { Utensils, TrendingUp, Store } from 'lucide-react';

export default function Home() {
  const allProducts = enrichProductsWithBestValue(loadProducts());
  const bestValueProducts = getBestValueProducts(allProducts, 4);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-600 to-primary-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find the Best Value Food
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Compare prices, ratings, and deals across restaurants
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar size="lg" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Compare Products</h3>
              <p className="text-gray-600">See side-by-side comparisons of the same dish across different sellers</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-success-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Best Value Score</h3>
              <p className="text-gray-600">Our algorithm finds the best bang for your buck considering taste, price, and portion</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-warning-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Seller Insights</h3>
              <p className="text-gray-600">Restaurants can see which products win and which need improvement</p>
            </div>
          </div>

          {/* Featured Best Value Products */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Best Value Picks</h2>
              <Badge variant="success">Top Rated</Badge>
            </div>
            <ProductList products={bestValueProducts} />
          </div>
        </div>
      </section>
    </main>
  );
}
