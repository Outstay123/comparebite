/**
 * Product filtering utilities for CompareBite
 * Supports category, seller type, price, and drink filtering
 */

import { Product } from './types';
import { getSellerType, isHiddenGem } from './local-boost';

// Major chains for seller type detection
const MAJOR_CHAINS = [
  'mcdonalds', 'kfc', 'burger_king', 'marrybrown', '4fingers',
  'texas_chicken', 'pizza_hut', 'dominos', 'subway', 'starbucks',
  'coffee_bean', 'tealive', 'chatime', 'zus_coffee', 'familymart',
];

/**
 * Check if a product is a drink based on product_type or categories
 */
export function isDrink(product: Product): boolean {
  const drinkTypes = ['drink', 'beverage', 'coffee', 'tea'];
  const drinkCategories = [
    'coffee', 'latte', 'milk_tea', 'teh_ais', 'teh_tarik', 'matcha',
    'chocolate_drink', 'fruit_tea', 'smoothie', 'soft_drink',
    'bottled_water', 'drink', 'beverage'
  ];
  
  // Check product_type
  if (drinkTypes.includes(product.product_type)) {
    return true;
  }
  
  // Check categories
  return product.categories.some(cat => 
    drinkCategories.includes(cat.toLowerCase())
  );
}

/**
 * Get products by category
 */
export function getProductsByCategory(products: Product[], category: string): Product[] {
  const normalizedCategory = category.toLowerCase();
  return products.filter(p => 
    p.categories.some(cat => cat.toLowerCase() === normalizedCategory)
  );
}

/**
 * Get products by seller type (local or chain)
 */
export function getProductsBySellerType(products: Product[], sellerType: 'local' | 'chain'): Product[] {
  return products.filter(p => getSellerType(p) === sellerType);
}

/**
 * Get products under a maximum price
 */
export function getProductsUnderPrice(products: Product[], maxPrice: number): Product[] {
  return products.filter(p => p.price <= maxPrice);
}

/**
 * Get all drink products
 */
export function getDrinkProducts(products: Product[]): Product[] {
  return products.filter(isDrink);
}

/**
 * Get local products (using local-boost.ts)
 */
export function getLocalProducts(products: Product[]): Product[] {
  return getProductsBySellerType(products, 'local');
}

/**
 * Get chain products (using local-boost.ts)
 */
export function getChainProducts(products: Product[]): Product[] {
  return getProductsBySellerType(products, 'chain');
}

/**
 * Get hidden gem products
 */
export function getHiddenGemProducts(products: Product[]): Product[] {
  return products.filter(isHiddenGem);
}

/**
 * Get top value products sorted by best_value_score
 */
export function getTopValueProducts(products: Product[], limit: number = 4): Product[] {
  return [...products]
    .sort((a, b) => (b.best_value_score || 0) - (a.best_value_score || 0))
    .slice(0, limit);
}

/**
 * Get Malaysian food products (traditional categories)
 */
export function getMalaysianFoodProducts(products: Product[]): Product[] {
  const malaysianCategories = [
    'nasi_lemak', 'roti_canai', 'char_kuey_teow', 'mee_goreng',
    'laksa', 'satay', 'nasi_kandar', 'mamak', 'malaysian'
  ];
  
  return products.filter(p => 
    p.categories.some(cat => 
      malaysianCategories.includes(cat.toLowerCase())
    )
  );
}

/**
 * Filter products with multiple criteria
 */
export interface FilterCriteria {
  category?: string;
  sellerType?: 'local' | 'chain';
  maxPrice?: number;
  minPrice?: number;
  isDrink?: boolean;
  isHiddenGem?: boolean;
}

export function filterProducts(products: Product[], criteria: FilterCriteria): Product[] {
  return products.filter(product => {
    // Category filter
    if (criteria.category) {
      const hasCategory = product.categories.some(
        cat => cat.toLowerCase() === criteria.category!.toLowerCase()
      );
      if (!hasCategory) return false;
    }
    
    // Seller type filter
    if (criteria.sellerType && getSellerType(product) !== criteria.sellerType) {
      return false;
    }
    
    // Price filters
    if (criteria.maxPrice !== undefined && product.price > criteria.maxPrice) {
      return false;
    }
    if (criteria.minPrice !== undefined && product.price < criteria.minPrice) {
      return false;
    }
    
    // Drink filter
    if (criteria.isDrink !== undefined) {
      if (isDrink(product) !== criteria.isDrink) return false;
    }
    
    // Hidden gem filter
    if (criteria.isHiddenGem !== undefined) {
      if (isHiddenGem(product) !== criteria.isHiddenGem) return false;
    }
    
    return true;
  });
}

/**
 * Parse search query params into filter criteria
 */
export function parseSearchParams(searchParams: URLSearchParams): FilterCriteria {
  const criteria: FilterCriteria = {};
  
  const category = searchParams.get('category');
  if (category) criteria.category = category;
  
  const sellerType = searchParams.get('sellerType') as 'local' | 'chain' | null;
  if (sellerType && ['local', 'chain'].includes(sellerType)) {
    criteria.sellerType = sellerType;
  }
  
  const maxPrice = searchParams.get('maxPrice');
  if (maxPrice) criteria.maxPrice = parseFloat(maxPrice);
  
  const minPrice = searchParams.get('minPrice');
  if (minPrice) criteria.minPrice = parseFloat(minPrice);
  
  const isDrinkParam = searchParams.get('isDrink');
  if (isDrinkParam === 'true') criteria.isDrink = true;
  
  return criteria;
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(categoryId: string): string {
  const displayNames: Record<string, string> = {
    'nasi_lemak': 'Nasi Lemak',
    'fried_chicken': 'Fried Chicken',
    'chicken_chop': 'Chicken Chop',
    'burger': 'Burger',
    'rice_bowl': 'Rice Bowl',
    'mee_goreng': 'Mee Goreng',
    'char_kuey_teow': 'Char Kuey Teow',
    'roti_canai': 'Roti Canai',
    'satay': 'Satay',
    'laksa': 'Laksa',
    'ayam_gepuk': 'Ayam Gepuk',
    'pasta': 'Pasta',
    'fries': 'Fries',
    'dessert': 'Dessert',
    'coffee': 'Coffee',
    'latte': 'Latte',
    'milk_tea': 'Milk Tea',
    'teh_ais': 'Teh Ais',
    'teh_tarik': 'Teh Tarik',
    'matcha': 'Matcha',
    'chocolate_drink': 'Chocolate Drink',
    'fruit_tea': 'Fruit Tea',
    'smoothie': 'Smoothie',
    'soft_drink': 'Soft Drink',
    'bottled_water': 'Bottled Water',
    'drink': 'Drinks',
    'local': 'Local',
    'chain': 'Chain',
  };
  
  return displayNames[categoryId.toLowerCase()] || 
    categoryId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Get all available categories with counts
 */
export function getCategoriesWithCounts(products: Product[]): { id: string; name: string; count: number }[] {
  const categoryMap = new Map<string, number>();
  
  products.forEach(product => {
    product.categories.forEach(cat => {
      const normalized = cat.toLowerCase();
      categoryMap.set(normalized, (categoryMap.get(normalized) || 0) + 1);
    });
  });
  
  return Array.from(categoryMap.entries())
    .map(([id, count]) => ({
      id,
      name: getCategoryDisplayName(id),
      count
    }))
    .sort((a, b) => b.count - a.count);
}
