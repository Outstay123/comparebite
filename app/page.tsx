'use client';

import { SearchBar } from '@/components/search/SearchBar';
import { ProductList } from '@/components/product/ProductList';
import { loadProducts, enrichProductsWithBestValue } from '@/lib/utils/data';
import { getBestValueProducts } from '@/lib/utils/seller';
import { SmallBusinessSpotlight } from '@/components/home/SmallBusinessSpotlight';
import { HomeCategorySection } from '@/components/home/HomeCategorySection';
import { Badge } from '@/components/ui/Badge';
import { Utensils, TrendingUp, Store } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import {
  getLocalProducts,
  getChainProducts,
  getDrinkProducts,
  getProductsUnderPrice,
  getHiddenGemProducts,
  getMalaysianFoodProducts,
  getTopValueProducts,
} from '@/lib/product-filters';

export default function Home() {
  const allProducts = enrichProductsWithBestValue(loadProducts());
  const bestValueProducts = getBestValueProducts(allProducts, 4);
  
  // Get products for each section
  const localProducts = getTopValueProducts(getLocalProducts(allProducts), 4);
  const chainProducts = getTopValueProducts(getChainProducts(allProducts), 4);
  const drinkProducts = getTopValueProducts(getDrinkProducts(allProducts), 4);
  const under10Products = getTopValueProducts(getProductsUnderPrice(allProducts, 10), 4);
  const hiddenGemProducts = getHiddenGemProducts(allProducts);
  const malaysianFoodProducts = getTopValueProducts(getMalaysianFoodProducts(allProducts), 4);

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

      {/* CTA Section */}
      <section className="bg-blue-50 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Start Saving Today
        </h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Join thousands of savvy diners who use CompareBite to find the best value meals
        </p>
        <Link href="/search">
          <Button variant="primary" size="lg">
            Explore All Products
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </section>

      {/* Small Business Spotlight */}
      <SmallBusinessSpotlight products={allProducts} />

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
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Best Value Picks</h2>
              <Badge variant="success">Top Rated</Badge>
            </div>
            <ProductList products={bestValueProducts} />
          </div>

          {/* Best Local Picks */}
          <HomeCategorySection
            title="Best Local Picks"
            description="Support high-value local F&B sellers near you."
            products={localProducts}
            viewMoreLink="/search?sellerType=local"
            viewMoreLabel="View All Local"
            badge="local"
          />

          {/* Best Chain Picks */}
          <HomeCategorySection
            title="Best Chain Picks"
            description="Compare familiar brands by value, not just popularity."
            products={chainProducts}
            viewMoreLink="/search?sellerType=chain"
            viewMoreLabel="View All Chains"
            badge="chain"
          />

          {/* Drinks Worth Your Money */}
          <HomeCategorySection
            title="Drinks Worth Your Money"
            description="Find drinks that are actually worth the price."
            products={drinkProducts}
            viewMoreLink="/search?category=drink"
            viewMoreLabel="View All Drinks"
            badge="drink"
          />

          {/* Meals Under RM10 */}
          <HomeCategorySection
            title="Meals Under RM10"
            description="Quality meals that won't break the bank."
            products={under10Products}
            viewMoreLink="/search?maxPrice=10"
            viewMoreLabel="View More Under RM10"
            badge="under_10"
          />

          {/* Local Hidden Gems */}
          <HomeCategorySection
            title="Local Hidden Gems"
            description="High-value local options that deserve more visibility."
            products={hiddenGemProducts}
            viewMoreLink="/leaderboard"
            viewMoreLabel="Discover More Gems"
            badge="hidden_gem"
          />

          {/* Popular Malaysian Food */}
          <HomeCategorySection
            title="Popular Malaysian Food"
            description="Authentic local flavors that define Malaysian cuisine."
            products={malaysianFoodProducts}
            viewMoreLink="/search?category=nasi_lemak"
            viewMoreLabel="Explore Malaysian Food"
          />

        </div>
      </section>
    </main>
  );
}
