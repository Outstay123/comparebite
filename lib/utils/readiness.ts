import { Product, ReadinessScore } from '@/lib/types';
import { calculateBestValueScore } from './bestValue';

export function calculateReadinessScore(
  product: Product,
  categoryAvgRating: number,
  categoryAvgPrice: number
): ReadinessScore {
  // 1. Rating readiness (25%)
  // Need 4.0+ to be competitive, 3.5-4.0 acceptable, <3.5 needs work
  const ratingReadiness = Math.min((product.average_rating / 4.0) * 100, 100);

  // 2. Price competitiveness (25%)
  // Within 10% of category average = competitive
  const priceDiff = Math.abs(product.price - categoryAvgPrice) / categoryAvgPrice;
  const priceCompetitiveness = priceDiff <= 0.1 ? 100 : Math.max(0, 100 - (priceDiff * 200));

  // 3. Review confidence (20%)
  // Need at least 5 reviews for credibility
  const reviewConfidence = Math.min((product.review_count / 5) * 100, 100);

  // 4. Value proposition (30%)
  // Based on Best Value score
  const bestValueScore = product.best_value_score || calculateBestValueScore(product, categoryAvgPrice);
  const valueProposition = bestValueScore * 100;

  const overallScore = Math.round(
    (ratingReadiness * 0.25) +
    (priceCompetitiveness * 0.25) +
    (reviewConfidence * 0.20) +
    (valueProposition * 0.30)
  );

  // Generate recommendations
  const recommendations: string[] = [];
  if (product.average_rating < 4.0) {
    recommendations.push(`Rating is ${product.average_rating.toFixed(1)}/5. Improve taste or portion to reach 4.0+ before listing.`);
  }
  if (product.price > categoryAvgPrice * 1.15) {
    recommendations.push(`Price is ${((product.price / categoryAvgPrice - 1) * 100).toFixed(0)}% above category average. Consider offers or price adjustment.`);
  }
  if (product.review_count < 5) {
    recommendations.push(`Only ${product.review_count} reviews. Gather more feedback for credibility.`);
  }
  if (bestValueScore < 0.6) {
    recommendations.push(`Value score is ${(bestValueScore * 100).toFixed(0)}/100. Review pricing, portion, or offers to compete.`);
  }
  if (recommendations.length === 0) {
    recommendations.push('This product is ready to list! It scores well across all metrics.');
  }

  let status: 'ready' | 'needs_improvement' | 'not_ready';
  if (overallScore >= 75) status = 'ready';
  else if (overallScore >= 50) status = 'needs_improvement';
  else status = 'not_ready';

  return {
    product_id: product.id,
    overall_score: overallScore,
    status,
    breakdown: {
      rating_readiness: Math.round(ratingReadiness),
      price_competitiveness: Math.round(priceCompetitiveness),
      review_confidence: Math.round(reviewConfidence),
      value_proposition: Math.round(valueProposition),
    },
    recommendations,
  };
}

export function getReadinessOverview(products: Product[]): {
  ready: number;
  needs_improvement: number;
  not_ready: number;
} {
  let ready = 0;
  let needs_improvement = 0;
  let not_ready = 0;

  // Calculate category averages
  const categoryPrices: Record<string, number[]> = {};
  const categoryRatings: Record<string, number[]> = {};

  products.forEach(p => {
    const category = p.categories[0];
    if (!categoryPrices[category]) {
      categoryPrices[category] = [];
      categoryRatings[category] = [];
    }
    categoryPrices[category].push(p.price);
    categoryRatings[category].push(p.average_rating);
  });

  const categoryAvgPrices: Record<string, number> = {};
  const categoryAvgRatings: Record<string, number> = {};

  Object.keys(categoryPrices).forEach(cat => {
    categoryAvgPrices[cat] = categoryPrices[cat].reduce((a, b) => a + b, 0) / categoryPrices[cat].length;
    categoryAvgRatings[cat] = categoryRatings[cat].reduce((a, b) => a + b, 0) / categoryRatings[cat].length;
  });

  products.forEach(product => {
    const category = product.categories[0];
    const score = calculateReadinessScore(
      product,
      categoryAvgRatings[category] || 4,
      categoryAvgPrices[category] || product.price
    );

    if (score.status === 'ready') ready++;
    else if (score.status === 'needs_improvement') needs_improvement++;
    else not_ready++;
  });

  return { ready, needs_improvement, not_ready };
}

export function getQuickWins(products: Product[]): Product[] {
  // Calculate category averages
  const categoryPrices: Record<string, number[]> = {};
  const categoryRatings: Record<string, number[]> = {};

  products.forEach(p => {
    const category = p.categories[0];
    if (!categoryPrices[category]) {
      categoryPrices[category] = [];
      categoryRatings[category] = [];
    }
    categoryPrices[category].push(p.price);
    categoryRatings[category].push(p.average_rating);
  });

  const categoryAvgPrices: Record<string, number> = {};
  const categoryAvgRatings: Record<string, number> = {};

  Object.keys(categoryPrices).forEach(cat => {
    categoryAvgPrices[cat] = categoryPrices[cat].reduce((a, b) => a + b, 0) / categoryPrices[cat].length;
    categoryAvgRatings[cat] = categoryRatings[cat].reduce((a, b) => a + b, 0) / categoryRatings[cat].length;
  });

  return products.filter(product => {
    const category = product.categories[0];
    const score = calculateReadinessScore(
      product,
      categoryAvgRatings[category] || 4,
      categoryAvgPrices[category] || product.price
    );
    return score.overall_score >= 65 && score.overall_score < 75;
  });
}

export function getHiddenGems(products: Product[]): Product[] {
  return products.filter(p => p.average_rating >= 4.0 && p.review_count < 5);
}
