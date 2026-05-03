'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProductComparison } from '@/components/product/ProductComparison';
import { loadProducts, getProductById, enrichProductsWithBestValue } from '@/lib/utils/data';
import { searchProducts } from '@/lib/utils/search';
import { formatPrice, formatRating } from '@/lib/utils/formatters';
import { ArrowLeft, Plus, X } from 'lucide-react';

function CompareContent() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get('ids') || '';
  const initialIds = idsParam.split(',').filter(Boolean);

  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);
  const [showAddPanel, setShowAddPanel] = useState(false);

  const allProducts = useMemo(() => enrichProductsWithBestValue(loadProducts()), []);

  const selectedProducts = selectedIds
    .map(id => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  // Get products that can be added (same category as first selected)
  const addableProducts = useMemo(() => {
    if (selectedProducts.length === 0) return allProducts;
    const firstCategory = selectedProducts[0]?.categories[0];
    return allProducts.filter(p => 
      p.categories.includes(firstCategory || '') && !selectedIds.includes(p.id)
    );
  }, [allProducts, selectedIds, selectedProducts]);

  const removeProduct = (id: string) => {
    setSelectedIds(prev => prev.filter(pid => pid !== id));
  };

  const addProduct = (id: string) => {
    if (selectedIds.length < 4) {
      setSelectedIds(prev => [...prev, id]);
    }
    setShowAddPanel(false);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/search" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Search
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Compare Products</h1>

        {selectedProducts.length === 0 ? (
          <Card>
            <CardBody className="p-12 text-center">
              <p className="text-gray-500 mb-4">No products selected for comparison</p>
              <Link href="/search">
                <Button>Search Products</Button>
              </Link>
            </CardBody>
          </Card>
        ) : (
          <>
            {/* Selected Products Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {selectedProducts.map((product) => (
                <Card key={product.id} className="relative">
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="absolute top-2 right-2 p-1 bg-gray-100 rounded-full hover:bg-gray-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <CardBody className="p-4">
                    <div className="w-full h-24 bg-gray-200 rounded mb-3 flex items-center justify-center">
                      <span className="text-sm text-gray-400 text-center px-2">{product.name}</span>
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.seller_name}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold text-primary-600">
                        {formatPrice(product.price, product.currency)}
                      </span>
                      <Badge variant="default">{formatRating(product.average_rating)}★</Badge>
                    </div>
                    {product.best_value_score && product.best_value_score >= 0.7 && (
                      <Badge variant="success" className="mt-2 w-full justify-center">
                        Best Value #{(product.best_value_score * 100).toFixed(0)}%
                      </Badge>
                    )}
                  </CardBody>
                </Card>
              ))}

              {/* Add Button */}
              {selectedProducts.length < 4 && (
                <button
                  onClick={() => setShowAddPanel(true)}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center hover:border-primary-400 hover:bg-primary-50 transition-colors"
                >
                  <Plus className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Add Product</span>
                </button>
              )}
            </div>

            {/* Comparison Table */}
            <Card>
              <CardHeader>
                <h2 className="font-bold text-gray-900">Detailed Comparison</h2>
              </CardHeader>
              <CardBody>
                <ProductComparison products={selectedProducts} />
              </CardBody>
            </Card>

            {/* Add Product Panel */}
            {showAddPanel && (
              <Card className="mt-6">
                <CardHeader className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-900">Add Product to Compare</h3>
                  <button onClick={() => setShowAddPanel(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {addableProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => addProduct(product.id)}
                        className="text-left border rounded-lg p-3 hover:border-primary-400 hover:bg-primary-50 transition-colors"
                      >
                        <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                        <p className="text-sm text-gray-500">{product.seller_name}</p>
                        <p className="text-sm font-medium text-primary-600 mt-1">
                          {formatPrice(product.price, product.currency)}
                        </p>
                      </button>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}
          </>
        )}
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
