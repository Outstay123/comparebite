'use client';

import React from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Utensils, 
  Coffee, 
  Beef,
  Drumstick,
  Croissant,
  Sandwich,
  CupSoda,
  Leaf
} from 'lucide-react';

interface QuickCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
  sellers: string[];
  type: 'food' | 'drink';
}

interface QuickCompareProps {
  categories: QuickCategory[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
}

export function QuickCompare({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: QuickCompareProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No categories with enough products to compare.</p>
      </div>
    );
  }

  const foodCategories = categories.filter(c => c.type === 'food');
  const drinkCategories = categories.filter(c => c.type === 'drink');

  return (
    <div className="space-y-6">
      {/* Food Categories */}
      {foodCategories.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Utensils className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-900">Food</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {foodCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.id}
                onClick={() => onSelectCategory(category.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Drink Categories */}
      {drinkCategories.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Coffee className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-gray-900">Drinks</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {drinkCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.id}
                onClick={() => onSelectCategory(category.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface CategoryCardProps {
  category: QuickCategory;
  isSelected: boolean;
  onClick: () => void;
}

function CategoryCard({ category, isSelected, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative w-full text-left p-4 rounded-xl border-2 transition-all duration-200
        ${isSelected 
          ? 'border-primary-500 bg-primary-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-sm'
        }
      `}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`
          p-2 rounded-lg
          ${isSelected ? 'bg-primary-100' : 'bg-gray-100'}
        `}>
          {category.icon}
        </div>
      </div>
      
      <h4 className="font-semibold text-gray-900 text-sm mb-1">
        {category.name}
      </h4>
      
      <p className="text-xs text-gray-500 mb-2">
        Compare {category.count} options
      </p>
      
      <div className="flex flex-wrap gap-1">
        {category.sellers.slice(0, 2).map((seller, i) => (
          <span 
            key={i} 
            className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded"
          >
            {seller}
          </span>
        ))}
        {category.sellers.length > 2 && (
          <span className="text-[10px] text-gray-400">
            +{category.sellers.length - 2}
          </span>
        )}
      </div>

      {isSelected && (
        <Badge 
          variant="primary" 
          className="absolute top-2 right-2 text-[10px]"
        >
          Selected
        </Badge>
      )}
    </button>
  );
}

// Helper to get icon for category
export function getCategoryIcon(categoryId: string, className = "w-5 h-5"): React.ReactNode {
  const iconMap: Record<string, React.ReactNode> = {
    burger: <Beef className={`${className} text-orange-500`} />,
    fried_chicken: <Drumstick className={`${className} text-yellow-600`} />,
    chicken_chop: <Utensils className={`${className} text-amber-600`} />,
    nasi_lemak: <Leaf className={`${className} text-green-500`} />,
    roti_canai: <Croissant className={`${className} text-amber-500`} />,
    coffee: <Coffee className={`${className} text-amber-700`} />,
    latte: <Coffee className={`${className} text-amber-600`} />,
    milk_tea: <CupSoda className={`${className} text-pink-500`} />,
    teh_ais: <CupSoda className={`${className} text-amber-500`} />,
    matcha: <Leaf className={`${className} text-green-600`} />,
  };

  return iconMap[categoryId.toLowerCase()] || <Utensils className={`${className} text-gray-500`} />;
}
