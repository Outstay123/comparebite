'use client';

import React from 'react';
import { SearchFilters } from '@/lib/types';
import { getAllChains, getAllCategories } from '@/lib/utils/data';

interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const chains = getAllChains();
  const categories = getAllCategories();

  const handleChainToggle = (chain: string) => {
    const currentChains = filters.chains || [];
    const newChains = currentChains.includes(chain)
      ? currentChains.filter(c => c !== chain)
      : [...currentChains, chain];
    onFiltersChange({ ...filters, chains: newChains });
  };

  const handleCategoryToggle = (category: string) => {
    const currentCategories = filters.categories || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.slice(0, 8).map((category) => (
            <label key={category} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(filters.categories || []).includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-gray-700 capitalize">
                {category.replace(/_/g, ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Chains */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Sellers</h3>
        <div className="space-y-2">
          {chains.map((chain) => (
            <label key={chain} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(filters.chains || []).includes(chain)}
                onChange={() => handleChainToggle(chain)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-gray-700 capitalize">
                {chain.replace(/_/g, ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => onFiltersChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => onFiltersChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Min Rating */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Minimum Rating</h3>
        <select
          value={filters.minRating || ''}
          onChange={(e) => onFiltersChange({ ...filters, minRating: e.target.value ? Number(e.target.value) : undefined })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Any rating</option>
          <option value="4">4+ stars</option>
          <option value="3.5">3.5+ stars</option>
          <option value="3">3+ stars</option>
        </select>
      </div>
    </div>
  );
}
