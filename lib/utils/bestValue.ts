import { Product } from '@/lib/types';

export function calculateOfferScore(offers: Product['offers']): number {
  if (offers.length === 0) return 0;

  const bestOffer = offers.reduce((max, offer) => {
    if (offer.type === 'discount') return Math.max(max, offer.value / 100);
    if (offer.type === 'bundle') return Math.max(max, 0.2);
    return max;
  }, 0);

  return bestOffer;
}

export function calculateBestValueScore(product: Product, categoryAvgPrice: number): number {
  // 1. Rating quality (0-1) — weight: 30%
  const ratingScore = product.average_rating / 5;

  // 2. Affordability vs category average (0-1) — weight: 30%
  // Lower price = higher score, capped at 1.5x average
  const priceRatio = Math.min(categoryAvgPrice / product.price, 1.5) / 1.5;

  // 3. Portion satisfaction (0-1) — weight: 20%
  const portionScore = product.portion_score / 5;

  // 4. Offer bonus (0-1) — weight: 15%
  const offerScore = calculateOfferScore(product.offers);

  // 5. Review confidence (0-1) — weight: 5%
  const confidenceScore = Math.min(product.review_count / 10, 1);

  // Weighted sum
  const bestValueScore =
    (ratingScore * 0.30) +
    (priceRatio * 0.30) +
    (portionScore * 0.20) +
    (offerScore * 0.15) +
    (confidenceScore * 0.05);

  return Math.round(bestValueScore * 100) / 100;
}

export function getCategoryAveragePrice(products: Product[], category: string): number {
  const categoryProducts = products.filter(p => p.categories.includes(category));
  if (categoryProducts.length === 0) return 0;

  const total = categoryProducts.reduce((sum, p) => sum + p.price, 0);
  return total / categoryProducts.length;
}

export function enrichProductsWithBestValue(products: Product[]): Product[] {
  const allCategories = [...new Set(products.flatMap(p => p.categories))];
  const categoryAvgPrices: Record<string, number> = {};

  allCategories.forEach(category => {
    categoryAvgPrices[category] = getCategoryAveragePrice(products, category);
  });

  return products.map(product => {
    // Use the first category for price comparison
    const primaryCategory = product.categories[0];
    const categoryAvgPrice = categoryAvgPrices[primaryCategory] || product.price;

    return {
      ...product,
      best_value_score: calculateBestValueScore(product, categoryAvgPrice)
    };
  });
}
