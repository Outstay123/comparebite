'use client';

import { useState } from 'react';
import Link from 'next/link';
import { loadProducts, enrichProductsWithBestValue } from '@/lib/utils/data';
import {
  getLocalProducts,
  getChainProducts,
  rankProductsByValue,
  getSellerType,
  isHiddenGem,
  calculateFairOpportunityScore,
} from '@/lib/local-boost';
import { HiddenGemBadge } from '@/components/HiddenGemBadge';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Trophy,
  Store,
  Building2,
  ArrowRight,
  TrendingUp,
  Star,
  Sparkles,
  Utensils,
  Coffee,
} from 'lucide-react';
import { isDrink } from '@/lib/product-filters';

type TabType = 'all' | 'local' | 'chain';
type ProductType = 'food' | 'drinks';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [productType, setProductType] = useState<ProductType>('food');

  // Load and enrich products
  const allProducts = enrichProductsWithBestValue(loadProducts());
  
  // Filter by food/drinks first
  const foodProducts = allProducts.filter(p => !isDrink(p));
  const drinkProducts = allProducts.filter(isDrink);
  
  const productsToRank = productType === 'food' ? foodProducts : drinkProducts;
  
  // Get local and chain from the filtered set
  const localProducts = getLocalProducts(productsToRank);
  const chainProducts = getChainProducts(productsToRank);

  // Rank products by value
  const rankedAll = rankProductsByValue(productsToRank);
  const rankedLocal = rankProductsByValue(localProducts);
  const rankedChain = rankProductsByValue(chainProducts);

  const currentProducts =
    activeTab === 'local'
      ? rankedLocal
      : activeTab === 'chain'
      ? rankedChain
      : rankedAll;

  const productTypeTabs = [
    { id: 'food' as ProductType, label: 'Food', icon: Utensils },
    { id: 'drinks' as ProductType, label: 'Drinks', icon: Coffee },
  ];

  const tabs = [
    { id: 'all' as TabType, label: 'Best Value Overall', icon: Trophy },
    { id: 'local' as TabType, label: 'Local Business', icon: Store },
    { id: 'chain' as TabType, label: 'Chain', icon: Building2 },
  ];

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-b from-primary-600 to-primary-700 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-bold">Value Leaderboard</h1>
          </div>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto">
            Helping small businesses compete based on value, not brand size.
            <br />
            Discover high-value options from both local gems and trusted chains.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-success-600" />
              <span className="text-gray-600">{getLocalProducts(productsToRank).length} Local Businesses</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary-600" />
              <span className="text-gray-600">{getChainProducts(productsToRank).length} Chain Locations</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-gray-600">
                {productsToRank.filter(isHiddenGem).length} Hidden Gems
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Product Type Selector (Food/Drinks) */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex bg-gray-100 rounded-full p-1">
              {productTypeTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = productType === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setProductType(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-white text-primary-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Best Overall/Local/Chain Selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Leaderboard Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Seller
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Value Score
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentProducts.map((product, index) => {
                    const rank = index + 1;
                    const sellerType = getSellerType(product);
                    const fairScore = calculateFairOpportunityScore(product);

                    return (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* Rank */}
                        <td className="px-6 py-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                              rank === 1
                                ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                                : rank === 2
                                ? 'bg-gray-100 text-gray-700 border-2 border-gray-300'
                                : rank === 3
                                ? 'bg-orange-100 text-orange-800 border-2 border-orange-300'
                                : 'bg-gray-50 text-gray-500'
                            }`}
                          >
                            {rank}
                          </div>
                        </td>

                        {/* Product */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-gray-900">
                              {product.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <HiddenGemBadge product={product} size="sm" />
                            </div>
                          </div>
                        </td>

                        {/* Seller */}
                        <td className="px-6 py-4">
                          <span className="text-gray-700">{product.seller_name}</span>
                        </td>

                        {/* Type */}
                        <td className="px-6 py-4">
                          <Badge
                            variant={sellerType === 'local' ? 'success' : 'primary'}
                          >
                            {sellerType === 'local' ? 'Local' : 'Chain'}
                          </Badge>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900">
                            {formatCurrency(product.price)}
                          </span>
                        </td>

                        {/* Rating */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-medium text-gray-900">
                              {product.average_rating?.toFixed(1)}
                            </span>
                            <span className="text-gray-500 text-sm">
                              ({product.review_count * 10})
                            </span>
                          </div>
                        </td>

                        {/* Value Score */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  fairScore >= 80
                                    ? 'bg-success-500'
                                    : fairScore >= 60
                                    ? 'bg-primary-500'
                                    : 'bg-gray-400'
                                }`}
                                style={{ width: `${fairScore}%` }}
                              />
                            </div>
                            <span
                              className={`font-bold text-sm ${
                                fairScore >= 80
                                  ? 'text-success-600'
                                  : fairScore >= 60
                                  ? 'text-primary-600'
                                  : 'text-gray-600'
                              }`}
                            >
                              {fairScore}
                            </span>
                          </div>
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4">
                          <Link href={`/product/${product.id}`}>
                            <Button variant="outline" size="sm">
                              View
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Empty State */}
          {currentProducts.length === 0 && (
            <div className="text-center py-16">
              <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600">
                Check back later for more {activeTab} products.
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Discover more value-driven options
            </p>
            <Link href="/search">
              <Button variant="primary" size="lg">
                <Store className="w-4 h-4 mr-2" />
                Browse All Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
