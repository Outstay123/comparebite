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
