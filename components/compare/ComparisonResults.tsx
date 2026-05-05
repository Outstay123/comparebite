'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Product } from '@/lib/types';
import { formatPrice, formatRating } from '@/lib/utils/formatters';
import { getSellerType, isHiddenGem } from '@/lib/local-boost';
import { getProductsByCategory } from '@/lib/product-filters';
import { 
  Trophy, 
  Star, 
  Utensils, 
  DollarSign,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Check,
  X,
  ArrowRight,
  Plus,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';

interface ProductCompareCardProps {
  product: Product;
  isWinner: boolean;
  rank: number;
  avgPrice: number;
  avgRating: number;
}

function ProductCompareCard({ product, isWinner, rank, avgPrice, avgRating }: ProductCompareCardProps) {
  const sellerType = getSellerType(product);
  const hiddenGem = isHiddenGem(product);
  
  const priceDiff = avgPrice - product.price;
  const priceAdvantage = priceDiff > 0;
  const ratingDiff = product.average_rating - avgRating;

  return (
    <Card className={`relative overflow-hidden ${isWinner ? 'ring-2 ring-green-500' : ''}`}>
      {isWinner && (
        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
          Best Choice
        </div>
      )}

      <div className="absolute top-0 left-0 bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-br-lg">
        #{rank}
      </div>

      <CardBody className="p-4 pt-8">
        <div className="w-full h-24 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
          <span className="text-2xl">🍽️</span>
        </div>

        <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{product.seller_name}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant={sellerType === 'local' ? 'success' : 'default'} className="text-[10px]">
            {sellerType === 'local' ? 'Local' : 'Chain'}
          </Badge>
          {hiddenGem && (
            <Badge variant="primary" className="text-[10px]">
              <Sparkles className="w-3 h-3 mr-0.5" />
              Hidden Gem
            </Badge>
          )}
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Price</span>
            <div className="flex items-center gap-1">
              <span className={`font-bold ${isWinner ? 'text-green-600' : 'text-gray-900'}`}>
                {formatPrice(product.price, product.currency)}
              </span>
              {priceAdvantage && (
                <TrendingDown className="w-3 h-3 text-green-500" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Rating</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-sm">{formatRating(product.average_rating)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Value Score</span>
            <span className={`font-bold ${isWinner ? 'text-green-600' : 'text-gray-900'}`}>
              {((product.best_value_score || 0) * 100).toFixed(0)}/100
            </span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-2 text-xs">
          {isWinner ? (
            <div className="text-green-700">
              <span className="font-semibold">Best because:</span>
              <ul className="mt-1 space-y-0.5 text-green-600">
                {priceAdvantage && priceDiff > 1 && (
                  <li>• RM{priceDiff.toFixed(2)} cheaper than avg</li>
                )}
                {ratingDiff > 0 && (
                  <li>• Higher rating (+{ratingDiff.toFixed(1)})</li>
                )}
                <li>• Best overall value score</li>
              </ul>
            </div>
          ) : (
            <div className="text-gray-500">
              <span className="font-medium">Value Analysis:</span>
              <p className="mt-1">
                Score: {((product.best_value_score || 0) * 100).toFixed(0)}/100
              </p>
            </div>
          )}
        </div>

        <Link href={`/product/${product.id}`} className="block mt-3">
          <Button variant="outline" size="sm" className="w-full">
            View Details
          </Button>
        </Link>
      </CardBody>
    </Card>
  );
}

// Add Product Card Component
interface AddProductCardProps {
  addableProducts: Product[];
  onAddProduct?: (id: string) => void;
  showAddPanel: boolean;
  setShowAddPanel: (show: boolean) => void;
}

function AddProductCard({ addableProducts, onAddProduct, showAddPanel, setShowAddPanel }: AddProductCardProps) {
  const [selectedId, setSelectedId] = useState<string>('');
  
  const handleAdd = () => {
    if (selectedId && onAddProduct) {
      onAddProduct(selectedId);
      setSelectedId('');
      setShowAddPanel(false);
    }
  };

  return (
    <div className="relative">
      {!showAddPanel ? (
        <button
          onClick={() => setShowAddPanel(true)}
          className="w-full h-full min-h-[300px] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary-400 hover:bg-primary-50 transition-all"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Plus className="w-6 h-6 text-gray-400" />
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-700">Add Product</p>
            <p className="text-sm text-gray-500">{addableProducts.length} more to compare</p>
          </div>
        </button>
      ) : (
        <Card className="h-full min-h-[300px]">
          <CardBody className="p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sm text-gray-900">Add to Compare</h4>
              <button 
                onClick={() => setShowAddPanel(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mb-3">
              {addableProducts.length} products available
            </p>
            
            <div className="flex-1 overflow-y-auto space-y-2 max-h-48">
              {addableProducts.slice(0, 6).map(product => {
                const sellerType = getSellerType(product);
                return (
                  <button
                    key={product.id}
                    onClick={() => setSelectedId(product.id)}
                    className={`
                      w-full text-left p-2 rounded-lg border-2 transition-all
                      ${selectedId === product.id 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <p className="font-medium text-sm text-gray-900 truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 truncate flex-1">{product.seller_name}</span>
                      <span className="text-xs font-semibold text-primary-600">
                        {formatPrice(product.price, product.currency)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge variant={sellerType === 'local' ? 'success' : 'default'} className="text-[10px]">
                        {sellerType === 'local' ? 'Local' : 'Chain'}
                      </Badge>
                      <span className="text-[10px] text-gray-400">
                        {((product.best_value_score || 0) * 100).toFixed(0)}/100
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <Button 
              onClick={handleAdd}
              disabled={!selectedId}
              className="w-full mt-3"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add to Comparison
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

interface ComparisonResultsProps {
  products: Product[];
  allProducts?: Product[];
  primaryCategory?: string | null;
  onClear: () => void;
  onAddProduct?: (id: string) => void;
}

export function ComparisonResults({ products, allProducts = [], primaryCategory, onClear, onAddProduct }: ComparisonResultsProps) {
  if (products.length === 0) {
    return (
      <Card className="bg-gray-50 border-dashed border-2">
        <CardBody className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Comparison Yet
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Choose a quick comparison above or build your own custom comparison to see the results.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <span>Click a category card</span>
            <ArrowRight className="w-4 h-4" />
            <span>See instant results</span>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Find the best value product
  const winner = useMemo(() => {
    return products.reduce((best, current) => {
      return (current.best_value_score || 0) > (best.best_value_score || 0) ? current : best;
    }, products[0]);
  }, [products]);

  // Calculate stats for insights
  const avgPrice = products.reduce((sum, p) => sum + p.price, 0) / products.length;
  const avgRating = products.reduce((sum, p) => sum + p.average_rating, 0) / products.length;

  // Get available products to add (same PRIMARY category only, not already selected, max 4 total)
  const [showAddPanel, setShowAddPanel] = useState(false);
  const selectedIds = products.map(p => p.id);
  const canAddMore = products.length < 4;
  
  // Use provided primary category, or first product's first category
  const comparisonCategory = primaryCategory || products[0]?.categories[0] || '';
  
  // Find addable products from ONLY the same primary category
  const addableProducts = useMemo(() => {
    if (!canAddMore || !comparisonCategory || allProducts.length === 0) return [];
    
    return allProducts.filter(p => {
      // Not already selected
      if (selectedIds.includes(p.id)) return false;
      // Must have the exact same primary category
      return p.categories.includes(comparisonCategory);
    });
  }, [allProducts, selectedIds, comparisonCategory, canAddMore]);
  
  const hasAddableProducts = addableProducts.length > 0;

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Comparison Results</h2>
          <p className="text-sm text-gray-500">
            {products.length} products compared • Best Value highlighted
          </p>
        </div>
        <Button variant="outline" onClick={onClear} size="sm">
          Clear Comparison
        </Button>
      </div>

      {/* Winner Banner */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Trophy className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-green-100">Best Value Choice</p>
            <p className="font-bold text-lg">{winner.name}</p>
            <p className="text-sm text-green-100">
              from {winner.seller_name} • Value Score: {((winner.best_value_score || 0) * 100).toFixed(0)}/100
            </p>
          </div>
          <Link href={`/product/${winner.id}`}>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              size="sm"
            >
              View Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product, index) => (
          <ProductCompareCard
            key={product.id}
            product={product}
            isWinner={product.id === winner.id}
            rank={index + 1}
            avgPrice={avgPrice}
            avgRating={avgRating}
          />
        ))}
        
        {/* Add Product Card - only if can add more and has addable products */}
        {canAddMore && hasAddableProducts && (
          <AddProductCard 
            addableProducts={addableProducts}
            onAddProduct={onAddProduct}
            showAddPanel={showAddPanel}
            setShowAddPanel={setShowAddPanel}
          />
        )}
      </div>

      {/* Detailed Comparison Table */}
      <Card>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-700">Feature</th>
                  {products.map(product => (
                    <th 
                      key={product.id} 
                      className={`p-4 text-center min-w-[140px] ${
                        product.id === winner.id ? 'bg-green-50' : ''
                      }`}
                    >
                      <div className="font-semibold text-gray-900 text-sm">{product.name}</div>
                      {product.id === winner.id && (
                        <Badge variant="success" className="mt-1 text-[10px]">
                          Best Value
                        </Badge>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price Row */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">Price</td>
                  {products.map(product => {
                    const isLowest = product.price === Math.min(...products.map(p => p.price));
                    return (
                      <td 
                        key={product.id} 
                        className={`p-4 text-center ${product.id === winner.id ? 'bg-green-50/50' : ''}`}
                      >
                        <span className={`font-bold ${isLowest ? 'text-green-600' : 'text-gray-900'}`}>
                          {formatPrice(product.price, product.currency)}
                        </span>
                        {isLowest && <span className="text-xs text-green-600 ml-1">lowest</span>}
                      </td>
                    );
                  })}
                </tr>

                {/* Rating Row */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">Rating</td>
                  {products.map(product => {
                    const isHighest = product.average_rating === Math.max(...products.map(p => p.average_rating));
                    return (
                      <td 
                        key={product.id} 
                        className={`p-4 text-center ${product.id === winner.id ? 'bg-green-50/50' : ''}`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className={`font-semibold ${isHighest ? 'text-green-600' : ''}`}>
                            {formatRating(product.average_rating)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">({product.review_count})</span>
                      </td>
                    );
                  })}
                </tr>

                {/* Best Value Score Row */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">Value Score</td>
                  {products.map(product => {
                    const isBest = product.id === winner.id;
                    return (
                      <td 
                        key={product.id} 
                        className={`p-4 text-center ${isBest ? 'bg-green-50' : ''}`}
                      >
                        <span className={`font-bold text-lg ${isBest ? 'text-green-600' : 'text-gray-900'}`}>
                          {((product.best_value_score || 0) * 100).toFixed(0)}
                        </span>
                        <span className="text-xs text-gray-400">/100</span>
                      </td>
                    );
                  })}
                </tr>

                {/* Portion Row */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">Portion</td>
                  {products.map(product => (
                    <td 
                      key={product.id} 
                      className={`p-4 text-center ${product.id === winner.id ? 'bg-green-50/50' : ''}`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <Utensils className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold">{product.portion_score}</span>
                        <span className="text-gray-400">/5</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Taste Row */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">Taste</td>
                  {products.map(product => (
                    <td 
                      key={product.id} 
                      className={`p-4 text-center ${product.id === winner.id ? 'bg-green-50/50' : ''}`}
                    >
                      <span className="font-semibold">{product.taste_score}</span>
                      <span className="text-gray-400">/5</span>
                    </td>
                  ))}
                </tr>

                {/* Halal Row */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">Halal</td>
                  {products.map(product => (
                    <td 
                      key={product.id} 
                      className={`p-4 text-center ${product.id === winner.id ? 'bg-green-50/50' : ''}`}
                    >
                      {product.is_halal ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>

                {/* Seller Type Row */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">Seller Type</td>
                  {products.map(product => {
                    const sellerType = getSellerType(product);
                    return (
                      <td 
                        key={product.id} 
                        className={`p-4 text-center ${product.id === winner.id ? 'bg-green-50/50' : ''}`}
                      >
                        <Badge variant={sellerType === 'local' ? 'success' : 'default'}>
                          {sellerType === 'local' ? 'Local' : 'Chain'}
                        </Badge>
                      </td>
                    );
                  })}
                </tr>

                {/* Offers Row */}
                <tr>
                  <td className="p-4 font-medium text-gray-700">Offers</td>
                  {products.map(product => (
                    <td 
                      key={product.id} 
                      className={`p-4 text-center ${product.id === winner.id ? 'bg-green-50/50' : ''}`}
                    >
                      {product.offers.length > 0 ? (
                        <div className="space-y-1">
                          {product.offers.slice(0, 2).map(offer => (
                            <Badge key={offer.id} variant="primary" className="text-[10px]">
                              {offer.title}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
