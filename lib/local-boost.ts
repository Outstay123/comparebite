/**
 * Local Boost System
 * Helps small F&B businesses gain fair visibility
 */

import { Product } from './types';

// Major chain identifiers
const MAJOR_CHAINS = [
  'mcdonalds',
  'kfc',
  'burger_king',
  'marrybrown',
  '4fingers',
  'texas_chicken',
  'pizza_hut',
  'dominos',
  'subway',
  'starbucks',
  'coffee_bean',
  'tealive',
  'chatime',
];

/**
 * Determine seller type based on chain field
 */
export function getSellerType(product: Product): 'local' | 'chain' {
  const chain = product.chain?.toLowerCase() || '';
  return MAJOR_CHAINS.includes(chain) ? 'chain' : 'local';
}

/**
 * Check if a product is a Hidden Gem
 * High value, low visibility, local seller
 */
export function isHiddenGem(product: Product): boolean {
  const sellerType = getSellerType(product);
  const bestValueScore = product.best_value_score || 0;
  const reviewCount = product.review_count || 0;
  
  return (
    bestValueScore >= 75 &&
    reviewCount <= 30 &&
    sellerType === 'local'
  );
}

/**
 * Calculate Fair Opportunity Score
 * Boosts visibility for strong local sellers without ranking bad products high
 */
export function calculateFairOpportunityScore(product: Product): number {
  const bestValueScore = (product.best_value_score || 0.5) * 100;
  const sellerType = getSellerType(product);
  const reviewCount = product.review_count || 0;
  
  // Only apply boost if product has decent value score
  if (bestValueScore < 70) {
    return Math.min(Math.round(bestValueScore), 100);
  }
  
  const localBoost = sellerType === 'local' ? 5 : 0;
  const discoveryBoost = reviewCount < 30 ? 5 : 0;
  
  const rawScore = bestValueScore + localBoost + discoveryBoost;
  return Math.min(Math.round(rawScore), 100);
}

/**
 * Get all local products
 */
export function getLocalProducts(products: Product[]): Product[] {
  return products.filter(p => getSellerType(p) === 'local');
}

/**
 * Get all chain products
 */
export function getChainProducts(products: Product[]): Product[] {
  return products.filter(p => getSellerType(p) === 'chain');
}

/**
 * Get small business spotlight products
 * Top local products with good value, preferring lower review counts
 */
export function getSmallBusinessSpotlight(products: Product[], limit: number = 3): Product[] {
  const localProducts = getLocalProducts(products);
  
  // Score each product for spotlight potential
  const scored = localProducts.map(product => {
    const bestValueScore = product.best_value_score || 0;
    const reviewCount = product.review_count || 0;
    
    // Spotlight score: value score + discovery bonus for under-reviewed products
    const discoveryBonus = reviewCount < 20 ? 10 : reviewCount < 30 ? 5 : 0;
    const spotlightScore = bestValueScore + discoveryBonus;
    
    return { product, spotlightScore };
  });
  
  // Sort by spotlight score descending
  scored.sort((a, b) => b.spotlightScore - a.spotlightScore);
  
  return scored.slice(0, limit).map(s => s.product);
}

/**
 * Rank products by Best Value Score
 */
export function rankProductsByValue(products: Product[]): Product[] {
  return [...products].sort(
    (a, b) => (b.best_value_score || 0) - (a.best_value_score || 0)
  );
}

/**
 * Get Hidden Gem products
 */
export function getHiddenGems(products: Product[]): Product[] {
  return products.filter(isHiddenGem);
}

/**
 * Get spotlight reason for a product
 */
export function getSpotlightReason(product: Product): string {
  const reviewCount = product.review_count || 0;
  const bestValueScore = product.best_value_score || 0;
  const sellerType = getSellerType(product);
  
  if (sellerType === 'local' && reviewCount < 20 && bestValueScore >= 80) {
    return 'High value, affordable price, and still under-discovered.';
  }
  
  if (sellerType === 'local' && bestValueScore >= 75) {
    return 'Strong value offering from a local business.';
  }
  
  if (bestValueScore >= 80) {
    return 'Excellent value for money.';
  }
  
  return 'Great value option worth trying.';
}
