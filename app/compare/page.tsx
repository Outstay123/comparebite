'use client';

import { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { QuickCompare, getCategoryIcon } from '@/components/compare/QuickCompare';
import { CustomCompare } from '@/components/compare/CustomCompare';
import { ComparisonResults } from '@/components/compare/ComparisonResults';
import { loadProducts, getProductById, enrichProductsWithBestValue } from '@/lib/utils/data';
import { isDrink, getProductsByCategory, getCategoryDisplayName } from '@/lib/product-filters';
import { getSellerType } from '@/lib/local-boost';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  ArrowRightLeft, 
  Search, 
  Utensils,
  Coffee,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Quick compare categories configuration
const QUICK_CATEGORIES = [
  // Food
  { id: 'burger', name: 'Burgers', type: 'food' as const, sellers: ['McD', 'Burger King', 'Local'] },
  { id: 'fried_chicken', name: 'Fried Chicken', type: 'food' as const, sellers: ['KFC', 'McD', 'Local'] },
  { id: 'chicken_chop', name: 'Chicken Chop', type: 'food' as const, sellers: ['Local', 'Western'] },
  { id: 'nasi_lemak', name: 'Nasi Lemak', type: 'food' as const, sellers: ['Local', 'Mamak'] },
  { id: 'roti_canai', name: 'Roti Canai', type: 'food' as const, sellers: ['Mamak', 'Local'] },
  // Drinks
  { id: 'coffee', name: 'Coffee', type: 'drink' as const, sellers: ['Starbucks', 'ZUS', 'Local'] },
  { id: 'latte', name: 'Latte', type: 'drink' as const, sellers: ['Starbucks', 'ZUS', 'Coffee Bean'] },
  { id: 'milk_tea', name: 'Milk Tea', type: 'drink' as const, sellers: ['Tealive', 'Chatime'] },
  { id: 'teh_ais', name: 'Teh Ais', type: 'drink' as const, sellers: ['Mamak', 'Local'] },
  { id: 'matcha', name: 'Matcha', type: 'drink' as const, sellers: ['Starbucks', 'Local'] },
];

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL params
  const idsParam = searchParams.get('ids') || '';
  const categoryParam = searchParams.get('category') || '';
  const initialIds = idsParam.split(',').filter(Boolean);
  
  // State
  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam || null);
  const [showCustomCompare, setShowCustomCompare] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  // Load and enrich products
  const allProducts = useMemo(() => enrichProductsWithBestValue(loadProducts()), []);

  // Get selected products
  const selectedProducts = useMemo(() => {
    return selectedIds
      .map(id => allProducts.find(p => p.id === id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined);
  }, [selectedIds, allProducts]);

  // Prepare quick categories with actual counts
  const quickCategories = useMemo(() => {
    return QUICK_CATEGORIES.map(cat => {
      const products = getProductsByCategory(allProducts, cat.id);
      const uniqueSellers = Array.from(new Set(products.map(p => {
        const type = getSellerType(p);
        return type === 'local' ? 'Local' : p.chain;
      }))).slice(0, 3);
      
      return {
        ...cat,
        icon: getCategoryIcon(cat.id),
        count: products.length,
        sellers: uniqueSellers.length > 0 ? uniqueSellers : cat.sellers,
      };
    }).filter(cat => cat.count >= 2); // Only show if 2+ products
  }, [allProducts]);

  // Handle quick category selection
  const handleQuickCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    // Get top products by best value score for this category
    const categoryProducts = getProductsByCategory(allProducts, categoryId);
    const topProducts = [...categoryProducts]
      .sort((a, b) => (b.best_value_score || 0) - (a.best_value_score || 0))
      .slice(0, 4);
    
    const newIds = topProducts.map(p => p.id);
    setSelectedIds(newIds);
    
    // Update URL
    router.replace(`/compare?category=${categoryId}&ids=${newIds.join(',')}`, { scroll: false });
  };

  // Handle custom compare
  const handleCustomCompare = (ids: string[], category: string) => {
    setSelectedIds(ids);
    setSelectedCategory(category || null);
    const query = category 
      ? `/compare?category=${category}&ids=${ids.join(',')}`
      : `/compare?ids=${ids.join(',')}`;
    router.replace(query, { scroll: false });
  };

  // Get current comparison category for filtering
  const comparisonCategory = selectedCategory || (selectedProducts[0]?.categories[0] || '');

  // Handle search - filter by same category if comparison is active
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const matches = allProducts.filter(p => {
      // Must match search query
      const matchesQuery = 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.seller_name.toLowerCase().includes(lowerQuery) ||
        p.categories.some(c => c.toLowerCase().includes(lowerQuery));
      
      if (!matchesQuery) return false;
      
      // If there's an active comparison, only show products from same category
      if (comparisonCategory) {
        return p.categories.includes(comparisonCategory);
      }
      
      return true;
    }).slice(0, 8);
    
    setSearchResults(matches.map(p => p.id));
  };

  // Add product from search - validate same category
  const addFromSearch = (id: string) => {
    const product = allProducts.find(p => p.id === id);
    if (!product) return;
    
    // Validate same category if comparison is active
    if (comparisonCategory && !product.categories.includes(comparisonCategory)) {
      return; // Can't add product from different category
    }
    
    if (selectedIds.length < 4 && !selectedIds.includes(id)) {
      const newIds = [...selectedIds, id];
      setSelectedIds(newIds);
      const query = comparisonCategory
        ? `/compare?category=${comparisonCategory}&ids=${newIds.join(',')}`
        : `/compare?ids=${newIds.join(',')}`;
      router.replace(query, { scroll: false });
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  // Clear comparison
  const handleClear = () => {
    setSelectedIds([]);
    setSelectedCategory(null);
    router.replace('/compare', { scroll: false });
  };

  // Handle initial URL params
  useEffect(() => {
    if (initialIds.length > 0) {
      // Validate and set from URL
      const validIds = initialIds.filter(id => allProducts.some(p => p.id === id));
      if (validIds.length !== selectedIds.length || validIds.some((id, i) => id !== selectedIds[i])) {
        setSelectedIds(validIds);
      }
    }
  }, [initialIds.join(','), allProducts.length]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-100 rounded-lg">
              <ArrowRightLeft className="w-6 h-6 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Compare Food & Drinks</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Instantly compare price, rating, portion, and value score across sellers. 
            Pick a category and see the best choice in seconds.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* 1. Comparison Results - MAIN HIGHLIGHT (at top) */}
        {selectedProducts.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ComparisonResults 
              products={selectedProducts} 
              allProducts={allProducts}
              primaryCategory={selectedCategory}
              onClear={handleClear}
              onAddProduct={addFromSearch}
            />
          </section>
        )}

        {/* 2. Quick Compare - Selection Method */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🔥</span>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Quick Compare</h2>
              <p className="text-sm text-gray-500">Start with popular comparisons</p>
            </div>
          </div>
          
          <Card className="bg-white">
            <CardBody className="p-6">
              <QuickCompare
                categories={quickCategories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleQuickCategorySelect}
              />
            </CardBody>
          </Card>
        </section>

        {/* 3. Custom Compare - Secondary */}
        <section>
          <button
            onClick={() => setShowCustomCompare(!showCustomCompare)}
            className="flex items-center gap-2 w-full text-left group"
          >
            <div className="flex items-center gap-2 flex-1">
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                <Utensils className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Build Your Own Comparison</h2>
                <p className="text-sm text-gray-500">Choose a category and select up to 4 items</p>
              </div>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
              {showCustomCompare ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </div>
          </button>
          
          {showCustomCompare && (
            <div className="mt-4">
              <CustomCompare
                products={allProducts}
                selectedIds={selectedIds}
                onCompare={handleCustomCompare}
              />
            </div>
          )}
        </section>

        {/* 4. Search to Compare */}
        <section>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="flex items-center gap-2 w-full text-left group"
          >
            <div className="flex items-center gap-2 flex-1">
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                <Search className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Search to Compare</h2>
                <p className="text-sm text-gray-500">Find specific products to compare</p>
              </div>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
              {showSearch ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </div>
          </button>
          
          {showSearch && (
            <Card className="mt-4 bg-white">
              <CardBody className="p-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search burger, latte, nasi lemak..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-2">
                    {searchResults.map(id => {
                      const product = allProducts.find(p => p.id === id);
                      if (!product) return null;
                      const isSelected = selectedIds.includes(id);
                      const canAdd = !isSelected && selectedIds.length < 4;
                      const sellerType = getSellerType(product);

                      return (
                        <button
                          key={id}
                          onClick={() => canAdd && addFromSearch(id)}
                          disabled={isSelected}
                          className={`
                            flex items-center gap-3 p-3 rounded-lg text-left transition-all
                            ${isSelected 
                              ? 'bg-green-50 border-2 border-green-300 opacity-60' 
                              : canAdd
                                ? 'bg-white border-2 border-gray-200 hover:border-primary-300'
                                : 'bg-gray-50 opacity-50 cursor-not-allowed'
                            }
                          `}
                        >
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0
                            ${isSelected ? 'bg-green-500 text-white' : 'bg-gray-200'}
                          `}>
                            {isSelected ? '✓' : '🍽️'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {product.seller_name}
                            </p>
                          </div>
                          {isSelected && (
                            <span className="text-xs text-green-600 font-medium">Added</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {searchQuery.length >= 2 && searchResults.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    No products found. Try a different search term.
                  </p>
                )}

                {/* Current Selection */}
                {selectedIds.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Currently comparing ({selectedIds.length}/4):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProducts.map(p => (
                        <div 
                          key={p.id}
                          className="flex items-center gap-2 bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full text-sm"
                        >
                          <span className="truncate max-w-[150px]">{p.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          )}
        </section>

      </div>
    </main>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading comparison...</div>
      </main>
    }>
      <CompareContent />
    </Suspense>
  );
}
