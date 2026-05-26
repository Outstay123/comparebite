'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProductList } from '@/components/product/ProductList';
import { loadProducts, enrichProductsWithBestValue } from '@/lib/utils/data';
import { getBestValueProducts } from '@/lib/utils/seller';
import { SmallBusinessSpotlight } from '@/components/home/SmallBusinessSpotlight';
import { HomeCategorySection } from '@/components/home/HomeCategorySection';
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel';
import { CompareModal } from '@/components/home/CompareModal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Utensils, TrendingUp, Store, ArrowRight } from 'lucide-react';
import {
  getLocalProducts,
  getChainProducts,
  getDrinkProducts,
  getProductsUnderPrice,
  getHiddenGemProducts,
  getMalaysianFoodProducts,
  getTopValueProducts,
} from '@/lib/product-filters';
import { Product } from '@/lib/types';

function mixFeaturedProducts(local: Product[], chain: Product[]): Product[] {
  const mixed: Product[] = [];
  const maxLen = Math.max(local.length, chain.length);
  for (let i = 0; i < maxLen && mixed.length < 6; i++) {
    if (local[i]) mixed.push(local[i]);
    if (chain[i] && mixed.length < 6) mixed.push(chain[i]);
  }
  return mixed;
}

export default function Home() {
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  const allProducts = enrichProductsWithBestValue(loadProducts());
  const bestValueProducts = getBestValueProducts(allProducts, 4);

  const localFeatured = getTopValueProducts(getLocalProducts(allProducts), 3);
  const chainFeatured = getTopValueProducts(getChainProducts(allProducts), 3);
  const featuredProducts = mixFeaturedProducts(localFeatured, chainFeatured);

  const localProducts = getTopValueProducts(getLocalProducts(allProducts), 4);
  const chainProducts = getTopValueProducts(getChainProducts(allProducts), 4);
  const drinkProducts = getTopValueProducts(getDrinkProducts(allProducts), 4);
  const under10Products = getTopValueProducts(getProductsUnderPrice(allProducts, 10), 4);
  const hiddenGemProducts = getHiddenGemProducts(allProducts);
  const malaysianFoodProducts = getTopValueProducts(getMalaysianFoodProducts(allProducts), 4);

  return (
    <main className="min-h-screen">
      {/* Hero + Featured Carousel + CTAs */}
      <section className="bg-gradient-to-b from-primary-600 to-primary-700 text-white pt-16 pb-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find the Best Value Food
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-primary-100">
            Compare prices, ratings, and deals across restaurants
          </p>
          <button
            type="button"
            onClick={() => setCompareModalOpen(true)}
            className="group relative inline-flex items-center justify-center gap-2.5 px-12 py-4 md:px-14 md:py-5 text-lg md:text-xl font-bold text-white rounded-2xl bg-gradient-to-b from-[#ff5a5a] via-primary-500 to-primary-700 border-2 border-[#ff8a8a]/60 shadow-[0_8px_32px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.15)_inset] hover:from-[#ff6b6b] hover:via-primary-400 hover:to-primary-600 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4),0_0_24px_rgba(255,90,90,0.35)] hover:scale-[1.04] active:scale-[0.98] transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-white/40"
          >
            Compare Now
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        <FeaturedCarousel products={featuredProducts} />

        <div className="flex justify-center mt-8">
          <Link href="/leaderboard">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white/90 text-white hover:bg-white/15 focus:ring-white/50 px-8"
            >
              View Leaderboard
            </Button>
          </Link>
        </div>
      </section>

      <CompareModal isOpen={compareModalOpen} onClose={() => setCompareModalOpen(false)} />

      <SmallBusinessSpotlight products={allProducts} />

      {/* Features — unchanged below spotlight */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Compare Products</h3>
              <p className="text-gray-600">
                See side-by-side comparisons of the same dish across different sellers
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-success-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Best Value Score</h3>
              <p className="text-gray-600">
                Our algorithm finds the best bang for your buck considering taste, price, and portion
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-warning-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Seller Insights</h3>
              <p className="text-gray-600">
                Restaurants can see which products win and which need improvement
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Best Value Picks</h2>
              <Badge variant="success">Top Rated</Badge>
            </div>
            <ProductList products={bestValueProducts} />
          </div>

          <HomeCategorySection
            title="Best Local Picks"
            description="Support high-value local F&B sellers near you."
            products={localProducts}
            viewMoreLink="/search?sellerType=local"
            viewMoreLabel="View All Local"
            badge="local"
          />

          <HomeCategorySection
            title="Best Chain Picks"
            description="Compare familiar brands by value, not just popularity."
            products={chainProducts}
            viewMoreLink="/search?sellerType=chain"
            viewMoreLabel="View All Chains"
            badge="chain"
          />

          <HomeCategorySection
            title="Drinks Worth Your Money"
            description="Find drinks that are actually worth the price."
            products={drinkProducts}
            viewMoreLink="/search?category=drink"
            viewMoreLabel="View All Drinks"
            badge="drink"
          />

          <HomeCategorySection
            title="Meals Under RM10"
            description="Quality meals that won't break the bank."
            products={under10Products}
            viewMoreLink="/search?maxPrice=10"
            viewMoreLabel="View More Under RM10"
            badge="under_10"
          />

          <HomeCategorySection
            title="Local Hidden Gems"
            description="High-value local options that deserve more visibility."
            products={hiddenGemProducts}
            viewMoreLink="/leaderboard"
            viewMoreLabel="Discover More Gems"
            badge="hidden_gem"
          />

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
