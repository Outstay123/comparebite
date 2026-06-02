'use client';

import { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchBar } from '@/components/search/SearchBar';
import { FilterPanel } from '@/components/search/FilterPanel';
import { ProductList } from '@/components/product/ProductList';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { loadProducts, enrichProductsWithBestValue } from '@/lib/utils/data';
import { searchProducts, sortProducts } from '@/lib/utils/search';
import { SearchFilters, SortOption } from '@/lib/types';
import { filterProducts, getCategoryDisplayName } from '@/lib/product-filters';
import { getSellerType } from '@/lib/local-boost';
import { SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const [browserSearchParams, setBrowserSearchParams] = useState<URLSearchParams | null>(null);

  useEffect(() => {
    setBrowserSearchParams(new URLSearchParams(window.location.search));
  }, [searchParams]);

  const activeSearchParams = browserSearchParams || searchParams;
  const query = activeSearchParams.get('q') || '';
  const categoryParam = activeSearchParams.get('category');
  const sellerTypeParam = activeSearchParams.get('sellerType');
  const maxPriceParam = activeSearchParams.get('maxPrice');

  // Parse URL filters
  const [filters, setFilters] = useState<SearchFilters>({});
  const [activeFilters, setActiveFilters] = useState<{type: string; value: string; label: string}[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('best_value');
  const [showFilters, setShowFilters] = useState(false);

  const allProducts = useMemo(() => enrichProductsWithBestValue(loadProducts()), []);

  // Build active filters from URL params
  useEffect(() => {
    const newFilters: SearchFilters = {};
    const newActiveFilters: {type: string; value: string; label: string}[] = [];

    if (categoryParam) {
      newFilters.categories = [categoryParam];
      newActiveFilters.push({
        type: 'category',
        value: categoryParam,
        label: `Category: ${getCategoryDisplayName(categoryParam)}`
      });
    }

    if (maxPriceParam) {
      const maxPrice = parseFloat(maxPriceParam);
      newFilters.maxPrice = maxPrice;
      newActiveFilters.push({
        type: 'maxPrice',
        value: maxPriceParam,
        label: `Under RM${maxPrice}`
      });
    }

    setFilters(newFilters);
    setActiveFilters(newActiveFilters);
  }, [categoryParam, maxPriceParam]);

  // Apply seller type filter separately (not part of SearchFilters)
  const filteredProducts = useMemo(() => {
    let products = allProducts;

    // Apply seller type filter first
    if (sellerTypeParam) {
      products = products.filter(p => getSellerType(p) === sellerTypeParam);
    }

    // Apply other filters and search
    const searched = searchProducts(products, query, filters);
    return sortProducts(searched, sortBy);
  }, [allProducts, query, filters, sortBy, sellerTypeParam]);

  // Add seller type to active filters display
  const allActiveFilters = useMemo(() => {
    const filters = [...activeFilters];
    if (sellerTypeParam) {
      filters.push({
        type: 'sellerType',
        value: sellerTypeParam,
        label: sellerTypeParam === 'local' ? 'Local Sellers' : 'Chain Brands'
      });
    }
    return filters;
  }, [activeFilters, sellerTypeParam]);

  // Clear a filter by navigating without the param
  const clearFilter = (type: string) => {
    const url = new URL(window.location.href);
    if (type === 'category') url.searchParams.delete('category');
    if (type === 'sellerType') url.searchParams.delete('sellerType');
    if (type === 'maxPrice') url.searchParams.delete('maxPrice');
    window.history.pushState({}, '', url);
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <a href="/" className="text-2xl font-bold text-primary-600">
              CompareBite
            </a>
            <div className="flex-1 max-w-xl">
              <SearchBar initialValue={query} />
            </div>
          </div>
        </div>
      </header>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`md:w-64 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <FilterPanel filters={filters} onFiltersChange={setFilters} />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {query ? `Results for "${query}"` : 'All Products'}
                  </h1>
                  <p className="text-gray-500">
                    {filteredProducts.length} products found
                  </p>
                  {/* Active Filter Badges */}
                  {allActiveFilters.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {allActiveFilters.map((filter) => (
                        <Badge
                          key={filter.type}
                          variant="primary"
                          className="flex items-center gap-1"
                        >
                          {filter.label}
                          <button
                            onClick={() => clearFilter(filter.type)}
                            className="ml-1 hover:text-primary-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden"
                  >
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                  </Button>

                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-gray-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="best_value">Best Value</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="reviews">Most Reviews</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <ProductList products={filteredProducts} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading search...</div>
      </main>
    }>
      <SearchContent />
    </Suspense>
  );
}
