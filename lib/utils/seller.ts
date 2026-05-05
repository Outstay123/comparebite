import { Product, SellerStats } from '@/lib/types';

export function getSellerStats(products: Product[]): SellerStats {
  if (products.length === 0) {
    return {
      total_products: 0,
      average_rating: 0,
      best_value_products: 0,
      total_reviews: 0
    };
  }

  const totalRating = products.reduce((sum, p) => sum + p.average_rating, 0);
  const totalReviews = products.reduce((sum, p) => sum + p.review_count, 0);
  const bestValueCount = products.filter(p => (p.best_value_score || 0) >= 0.7).length;

  return {
    total_products: products.length,
    average_rating: Math.round((totalRating / products.length) * 10) / 10,
    best_value_products: bestValueCount,
    total_reviews: totalReviews
  };
}

export function getTopRatedProducts(products: Product[], limit: number = 5): Product[] {
  return [...products]
    .sort((a, b) => b.average_rating - a.average_rating)
    .slice(0, limit);
}

export function getWorstRatedProducts(products: Product[], limit: number = 5): Product[] {
  return [...products]
    .sort((a, b) => a.average_rating - b.average_rating)
    .slice(0, limit);
}

export function getBestValueProducts(products: Product[], limit: number = 5): Product[] {
  return [...products]
    .sort((a, b) => (b.best_value_score || 0) - (a.best_value_score || 0))
    .slice(0, limit);
}

export function getProductsNeedingImprovement(products: Product[]): Product[] {
  return products.filter(p => p.average_rating < 3.5);
}

/**
 * Get similar products from the same category for comparison
 * - Same main category
 * - Different seller preferred
 * - Sorted by Best Value Score descending
 * - Limited to specified count
 */
export function getSimilarProducts(
  product: Product,
  allProducts: Product[],
  limit: number = 3
): Product[] {
  const mainCategory = product.categories[0];
  if (!mainCategory) return [];

  return allProducts
    .filter(p =>
      p.id !== product.id &&
      p.categories?.includes(mainCategory)
    )
    .sort((a, b) => (b.best_value_score || 0) - (a.best_value_score || 0))
    .slice(0, limit);
}

/**
 * Check if a product has enough similar products for comparison
 */
export function hasSimilarProducts(product: Product, allProducts: Product[]): boolean {
  return getSimilarProducts(product, allProducts, 1).length > 0;
}
