'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchBar } from '@/components/search/SearchBar';
import { FilterPanel } from '@/components/search/FilterPanel';
import { ProductList } from '@/components/product/ProductList';
import { Button } from '@/components/ui/Button';
import { loadProducts, enrichProductsWithBestValue } from '@/lib/utils/data';
import { searchProducts, sortProducts } from '@/lib/utils/search';
import { SearchFilters, SortOption } from '@/lib/types';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState<SortOption>('best_value');
  const [showFilters, setShowFilters] = useState(false);

  const allProducts = useMemo(() => enrichProductsWithBestValue(loadProducts()), []);

  const filteredProducts = useMemo(() => {
    const searched = searchProducts(allProducts, query, filters);
    return sortProducts(searched, sortBy);
  }, [allProducts, query, filters, sortBy]);

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
