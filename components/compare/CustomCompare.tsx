'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Utensils, 
  Coffee, 
  ChevronDown,
  X,
  Check,
  Plus
} from 'lucide-react';
import { Product } from '@/lib/types';
import { isDrink, getCategoryDisplayName } from '@/lib/product-filters';
import { formatPrice } from '@/lib/utils/formatters';
import { getSellerType } from '@/lib/local-boost';

interface CustomCompareProps {
  products: Product[];
  selectedIds: string[];
  onCompare: (ids: string[], category: string) => void;
}

export function CustomCompare({ products, selectedIds, onCompare }: CustomCompareProps) {
  const [productType, setProductType] = useState<'food' | 'drink'>('food');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>(selectedIds);
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  // Get filtered categories based on product type
  const availableCategories = useMemo(() => {
    const categorySet = new Map<string, number>();
    
    products.forEach(product => {
      const isProductDrink = isDrink(product);
      if ((productType === 'drink' && isProductDrink) || (productType === 'food' && !isProductDrink)) {
        product.categories.forEach(cat => {
          categorySet.set(cat, (categorySet.get(cat) || 0) + 1);
        });
      }
    });

    return Array.from(categorySet.entries())
      .map(([id, count]) => ({ id, name: getCategoryDisplayName(id), count }))
      .sort((a, b) => b.count - a.count);
  }, [products, productType]);

  // Get products for selected category
  const categoryProducts = useMemo(() => {
    if (!selectedCategory) return [];
    return products.filter(p => 
      p.categories.some(c => c.toLowerCase() === selectedCategory.toLowerCase())
    );
  }, [products, selectedCategory]);

  // Get selected products
  const selectedProducts = useMemo(() => {
    return localSelectedIds
      .map(id => products.find(p => p.id === id))
      .filter((p): p is Product => p !== undefined);
  }, [localSelectedIds, products]);

  const toggleProduct = (productId: string) => {
    setLocalSelectedIds(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      if (prev.length >= 4) {
        return prev; // Max 4 products
      }
      return [...prev, productId];
    });
  };

  const handleCompare = () => {
    onCompare(localSelectedIds, selectedCategory);
  };

  const canAddMore = localSelectedIds.length < 4;

  return (
    <Card className="bg-white">
      <CardBody className="p-6 space-y-6">
        {/* Step A: Product Type Toggle */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Step 1: Choose Product Type
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setProductType('food');
                setSelectedCategory('');
              }}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                ${productType === 'food'
                  ? 'bg-orange-100 text-orange-700 border-2 border-orange-300'
                  : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                }
              `}
            >
              <Utensils className="w-4 h-4" />
              Food
            </button>
            <button
              onClick={() => {
                setProductType('drink');
                setSelectedCategory('');
              }}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                ${productType === 'drink'
                  ? 'bg-amber-100 text-amber-700 border-2 border-amber-300'
                  : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                }
              `}
            >
              <Coffee className="w-4 h-4" />
              Drinks
            </button>
          </div>
        </div>

        {/* Step B: Category Dropdown */}
        {availableCategories.length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Step 2: Select Category
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setShowProductDropdown(true);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
              >
                <option value="">Choose a category...</option>
                {availableCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.count} products)
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Step C: Product Multi-Select */}
        {selectedCategory && categoryProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                Step 3: Select Products (max 4)
              </label>
              <Badge variant={localSelectedIds.length >= 4 ? 'error' : 'default'}>
                {localSelectedIds.length}/4 selected
              </Badge>
            </div>

            {/* Selected Products Chips */}
            {selectedProducts.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedProducts.map(product => (
                  <div 
                    key={product.id}
                    className="flex items-center gap-2 bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full text-sm"
                  >
                    <span className="truncate max-w-[150px]">{product.name}</span>
                    <button
                      onClick={() => toggleProduct(product.id)}
                      className="hover:bg-primary-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Product Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-2">
              {categoryProducts.map(product => {
                const isSelected = localSelectedIds.includes(product.id);
                const isDisabled = !isSelected && !canAddMore;
                const sellerType = getSellerType(product);

                return (
                  <button
                    key={product.id}
                    onClick={() => !isDisabled && toggleProduct(product.id)}
                    disabled={isDisabled}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg text-left transition-all
                      ${isSelected 
                        ? 'bg-primary-50 border-2 border-primary-300' 
                        : isDisabled
                          ? 'bg-gray-50 opacity-50 cursor-not-allowed'
                          : 'bg-white border-2 border-gray-200 hover:border-primary-300'
                      }
                    `}
                  >
                    <div className={`
                      w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                      ${isSelected 
                        ? 'bg-primary-500 border-primary-500' 
                        : 'border-gray-300'
                      }
                    `}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {product.seller_name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-semibold text-primary-600">
                          {formatPrice(product.price, product.currency)}
                        </span>
                        <Badge 
                          variant={sellerType === 'local' ? 'success' : 'default'}
                          className="text-[10px]"
                        >
                          {sellerType === 'local' ? 'Local' : 'Chain'}
                        </Badge>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {categoryProducts.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No products found in this category.
              </p>
            )}
          </div>
        )}

        {/* Step D: Compare Button */}
        {localSelectedIds.length >= 2 && (
          <div className="pt-4 border-t border-gray-200">
            <Button 
              onClick={handleCompare}
              className="w-full"
              size="lg"
            >
              Compare {localSelectedIds.length} Products
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
