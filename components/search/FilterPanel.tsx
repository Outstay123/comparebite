'use client';

import React from 'react';
import { SearchFilters } from '@/lib/types';
import { FilterSection } from './FilterSection';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

// Grouped category definitions
const CATEGORY_GROUPS = {
  meals: {
    title: '🍽️ Meals',
    categories: [
      { id: 'fried_chicken', label: 'Fried Chicken' },
      { id: 'chicken_chop', label: 'Chicken Chop' },
      { id: 'nasi_lemak', label: 'Nasi Lemak' },
      { id: 'nasi_campur', label: 'Nasi Campur' },
      { id: 'burger', label: 'Burger' },
      { id: 'rice_bowl', label: 'Rice Bowl' },
      { id: 'pizza', label: 'Pizza' },
      { id: 'sandwich', label: 'Sandwich' },
    ]
  },
  localMalaysian: {
    title: '🍜 Local Malaysian',
    categories: [
      { id: 'roti_canai', label: 'Roti Canai' },
      { id: 'char_kuey_teow', label: 'Char Kuey Teow' },
      { id: 'mee_goreng', label: 'Mee Goreng' },
      { id: 'laksa', label: 'Laksa' },
      { id: 'satay', label: 'Satay' },
      { id: 'ayam_gepuk', label: 'Ayam Gepuk' },
    ]
  },
  drinks: {
    title: '🥤 Drinks',
    categories: [
      { id: 'coffee', label: 'Coffee' },
      { id: 'latte', label: 'Latte' },
      { id: 'milk_tea', label: 'Milk Tea' },
      { id: 'teh_ais', label: 'Teh Ais' },
      { id: 'teh_tarik', label: 'Teh Tarik' },
      { id: 'matcha', label: 'Matcha' },
    ]
  },
};

// Price range options
const PRICE_RANGES = [
  { id: 'under10', label: 'Under RM10', min: 0, max: 10 },
  { id: '10to15', label: 'RM10 – RM15', min: 10, max: 15 },
  { id: '15to20', label: 'RM15 – RM20', min: 15, max: 20 },
  { id: 'over20', label: 'RM20+', min: 20, max: Infinity },
];

// Rating options
const RATING_OPTIONS = [
  { id: '4.5', label: '4.5+ ⭐', value: 4.5 },
  { id: '4.0', label: '4.0+ ⭐', value: 4.0 },
  { id: '3.5', label: '3.5+ ⭐', value: 3.5 },
];

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  // Helper to check if a category is selected
  const isCategorySelected = (categoryId: string) => 
    (filters.categories || []).includes(categoryId);

  // Helper to check if seller type is selected
  const isSellerTypeSelected = (type: string) => {
    // This will be handled via URL params in search page
    return false;
  };

  // Handle category toggle
  const handleCategoryToggle = (categoryId: string) => {
    const currentCategories = filters.categories || [];
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(c => c !== categoryId)
      : [...currentCategories, categoryId];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  // Handle price range selection
  const handlePriceRangeSelect = (rangeId: string) => {
    const range = PRICE_RANGES.find(r => r.id === rangeId);
    if (range) {
      onFiltersChange({
        ...filters,
        minPrice: range.min || undefined,
        maxPrice: range.max === Infinity ? undefined : range.max
      });
    }
  };

  // Check if price range is active
  const isPriceRangeActive = (rangeId: string) => {
    const range = PRICE_RANGES.find(r => r.id === rangeId);
    if (!range) return false;
    
    if (rangeId === 'over20') {
      return filters.minPrice === 20 && !filters.maxPrice;
    }
    return filters.minPrice === range.min && filters.maxPrice === range.max;
  };

  // Handle rating selection
  const handleRatingSelect = (value: number) => {
    const currentRating = filters.minRating;
    onFiltersChange({
      ...filters,
      minRating: currentRating === value ? undefined : value
    });
  };

  // Clear all filters
  const handleClearAll = () => {
    onFiltersChange({});
  };

  // Count active filters
  const activeFilterCount = 
    (filters.categories?.length || 0) +
    (filters.minPrice !== undefined ? 1 : 0) +
    (filters.maxPrice !== undefined ? 1 : 0) +
    (filters.minRating !== undefined ? 1 : 0);

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary-600" />
          <h2 className="font-bold text-gray-900">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      <div className="space-y-2">
        {/* Categories - Meals */}
        <FilterSection 
          title={CATEGORY_GROUPS.meals.title} 
          defaultOpen={true}
          count={filters.categories?.filter(c => 
            CATEGORY_GROUPS.meals.categories.some(cat => cat.id === c)
          ).length}
        >
          <div className="space-y-2">
            {CATEGORY_GROUPS.meals.categories.map((category) => (
              <label key={category.id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isCategorySelected(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
                />
                <span className="text-gray-700 text-sm group-hover:text-gray-900 transition-colors">
                  {category.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Categories - Local Malaysian */}
        <FilterSection 
          title={CATEGORY_GROUPS.localMalaysian.title}
          defaultOpen={true}
          count={filters.categories?.filter(c => 
            CATEGORY_GROUPS.localMalaysian.categories.some(cat => cat.id === c)
          ).length}
        >
          <div className="space-y-2">
            {CATEGORY_GROUPS.localMalaysian.categories.map((category) => (
              <label key={category.id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isCategorySelected(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
                />
                <span className="text-gray-700 text-sm group-hover:text-gray-900 transition-colors">
                  {category.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Categories - Drinks */}
        <FilterSection 
          title={CATEGORY_GROUPS.drinks.title}
          defaultOpen={true}
          count={filters.categories?.filter(c => 
            CATEGORY_GROUPS.drinks.categories.some(cat => cat.id === c)
          ).length}
        >
          <div className="space-y-2">
            {CATEGORY_GROUPS.drinks.categories.map((category) => (
              <label key={category.id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isCategorySelected(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
                />
                <span className="text-gray-700 text-sm group-hover:text-gray-900 transition-colors">
                  {category.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="💰 Price Range" defaultOpen={false}>
          <div className="space-y-2">
            {PRICE_RANGES.map((range) => (
              <label key={range.id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="priceRange"
                  checked={isPriceRangeActive(range.id)}
                  onChange={() => handlePriceRangeSelect(range.id)}
                  className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
                />
                <span className="text-gray-700 text-sm group-hover:text-gray-900 transition-colors">
                  {range.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Rating */}
        <FilterSection title="⭐ Rating" defaultOpen={false}>
          <div className="space-y-2">
            {RATING_OPTIONS.map((rating) => (
              <label key={rating.id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.minRating === rating.value}
                  onChange={() => handleRatingSelect(rating.value)}
                  className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
                />
                <span className="text-gray-700 text-sm group-hover:text-gray-900 transition-colors">
                  {rating.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );
}
