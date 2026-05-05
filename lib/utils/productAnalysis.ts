import { Product } from '@/lib/types';
import {
  TestProductInput,
  CategoryStats,
  TestProductReadinessScore,
  CompetitorProduct,
  PredictedRanking,
  PriceInsight,
  ImprovementTip,
  ProductAnalysis,
  BestValueExplanation,
} from '@/lib/types/productTester';
import { loadProducts } from './data';
import { calculateBestValueScore, getCategoryAveragePrice } from './bestValue';

// Convert test product input to Product format for scoring
export function convertToProduct(input: TestProductInput): Product {
  return {
    id: input.id,
    location_id: 'test_location',
    seller_name: input.sellerName,
    chain: input.chain,
    name: input.name,
    description: input.description,
    categories: [input.category],
    product_type: 'food',
    price: input.price,
    currency: input.currency,
    ingredients: input.ingredients,
    options: {},
    reviews: [],
    average_rating: input.sampleRating,
    review_count: input.sampleReviewCount,
    portion_score: input.portionScore,
    taste_score: input.tasteScore,
    value_score: input.valueScore,
    offers: input.hasOffer ? [{
      id: 'test_offer',
      title: input.offerType === 'discount' ? 'Discount' : input.offerType === 'bundle' ? 'Bundle' : 'Offer',
      type: input.offerType || 'discount',
      value: input.offerValue,
      description: input.offerDescription,
    }] : [],
    image_url: input.imageUrl,
    is_halal: input.isHalal,
    is_vegetarian: input.isVegetarian,
    allergens: input.allergens,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// Get category statistics from existing products
export function getCategoryStats(category: string, allProducts: Product[]): CategoryStats {
  const categoryProducts = allProducts.filter(p => p.categories.includes(category));
  
  if (categoryProducts.length === 0) {
    return {
      category,
      averagePrice: 0,
      productCount: 0,
      priceRange: { min: 0, max: 0 },
      averageRating: 0,
      topRatedProduct: null,
      cheapestProduct: null,
    };
  }

  const prices = categoryProducts.map(p => p.price);
  const ratings = categoryProducts.map(p => p.average_rating);
  
  const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  
  const sortedByRating = [...categoryProducts].sort((a, b) => b.average_rating - a.average_rating);
  const sortedByPrice = [...categoryProducts].sort((a, b) => a.price - b.price);

  return {
    category,
    averagePrice,
    productCount: categoryProducts.length,
    priceRange: {
      min: Math.min(...prices),
      max: Math.max(...prices),
    },
    averageRating,
    topRatedProduct: sortedByRating[0] ? {
      name: sortedByRating[0].name,
      price: sortedByRating[0].price,
      rating: sortedByRating[0].average_rating,
    } : null,
    cheapestProduct: sortedByPrice[0] ? {
      name: sortedByPrice[0].name,
      price: sortedByPrice[0].price,
      rating: sortedByPrice[0].average_rating,
    } : null,
  };
}

// Calculate product readiness score for test product
export function calculateTestProductReadinessScore(
  input: TestProductInput,
  categoryStats: CategoryStats
): TestProductReadinessScore {
  // 1. Information completeness (25%)
  let completenessScore = 0;
  if (input.name && input.name.length > 0) completenessScore += 20;
  if (input.description && input.description.length > 10) completenessScore += 20;
  if (input.ingredients.length > 0) completenessScore += 20;
  if (input.allergens.length > 0 || input.isHalal || input.isVegetarian) completenessScore += 20;
  if (input.imageUrl) completenessScore += 20;

  // 2. Price competitiveness (25%)
  let priceScore = 100;
  if (categoryStats.averagePrice > 0) {
    const priceDiff = Math.abs(input.price - categoryStats.averagePrice) / categoryStats.averagePrice;
    if (priceDiff <= 0.1) {
      priceScore = 100; // Within 10% of average
    } else if (priceDiff <= 0.2) {
      priceScore = 80; // Within 20%
    } else if (priceDiff <= 0.3) {
      priceScore = 60; // Within 30%
    } else {
      priceScore = Math.max(0, 100 - (priceDiff * 100));
    }
  }

  // 3. Quality scores (30%)
  const avgQualityScore = (input.tasteScore + input.portionScore + input.valueScore) / 3;
  const qualityScore = (avgQualityScore / 5) * 100;

  // 4. Differentiation/Offer (10%)
  const differentiationScore = input.hasOffer ? 100 : 40;

  // 5. Review confidence (10%)
  const confidenceScore = Math.min((input.sampleReviewCount / 10) * 100, 100);

  // Calculate overall score
  const overallScore = Math.round(
    (completenessScore * 0.25) +
    (priceScore * 0.25) +
    (qualityScore * 0.30) +
    (differentiationScore * 0.10) +
    (confidenceScore * 0.10)
  );

  let status: 'ready' | 'needs_improvement' | 'not_ready';
  if (overallScore >= 75) status = 'ready';
  else if (overallScore >= 50) status = 'needs_improvement';
  else status = 'not_ready';

  return {
    overallScore,
    status,
    breakdown: {
      completeness: Math.round(completenessScore),
      priceCompetitiveness: Math.round(priceScore),
      qualityScores: Math.round(qualityScore),
      differentiation: Math.round(differentiationScore),
      confidence: Math.round(confidenceScore),
    },
  };
}

// Calculate Best Value Score explanation breakdown
export function calculateBestValueExplanation(
  input: TestProductInput,
  categoryAvgPrice: number
): BestValueExplanation {
  const maxScore = 100;
  
  // Rating contribution (0-30 points) - higher rating = more points
  const ratingScore = Math.min((input.sampleRating / 5) * 30, 30);
  
  // Price contribution (0-30 points) - lower price relative to avg = more points
  let priceScore = 30;
  if (categoryAvgPrice > 0) {
    const priceRatio = input.price / categoryAvgPrice;
    if (priceRatio <= 0.7) priceScore = 30; // 30% cheaper than avg
    else if (priceRatio <= 0.85) priceScore = 24; // 15-30% cheaper
    else if (priceRatio <= 1.0) priceScore = 18; // 0-15% cheaper
    else if (priceRatio <= 1.15) priceScore = 12; // 0-15% more expensive
    else if (priceRatio <= 1.3) priceScore = 6; // 15-30% more expensive
    else priceScore = 0; // 30%+ more expensive
  }
  
  // Portion contribution (0-20 points)
  const portionScore = Math.min((input.portionScore / 5) * 20, 20);
  
  // Offer bonus (0-15 points)
  const offerBonus = input.hasOffer ? Math.min(input.offerValue / 100 * 15, 15) : 0;
  
  // Confidence bonus (0-5 points) based on review count
  const confidenceBonus = Math.min((input.sampleReviewCount / 20) * 5, 5);
  
  const total = ratingScore + priceScore + portionScore + offerBonus + confidenceBonus;
  
  return {
    ratingContribution: ratingScore,
    priceContribution: priceScore,
    portionContribution: portionScore,
    offerBonus: offerBonus,
    confidenceBonus: confidenceBonus,
    formula: `Rating(${ratingScore.toFixed(1)}) + Price(${priceScore.toFixed(1)}) + Portion(${portionScore.toFixed(1)}) + Offer(${offerBonus.toFixed(1)}) + Confidence(${confidenceBonus.toFixed(1)}) = ${total.toFixed(1)}`,
    breakdown: {
      rating: { value: ratingScore, max: 30, description: 'Based on customer rating (0-5 stars)' },
      price: { value: priceScore, max: 30, description: 'Based on price vs category average' },
      portion: { value: portionScore, max: 20, description: 'Based on portion satisfaction score' },
      offer: { value: offerBonus, max: 15, description: 'Bonus for active promotions/offers' },
      confidence: { value: confidenceBonus, max: 5, description: 'Bonus for review volume confidence' },
    }
  };
}

// Calculate price insight with savings
export function calculatePriceInsight(
  input: TestProductInput,
  categoryStats: CategoryStats
): PriceInsight {
  const categoryAverage = categoryStats.averagePrice;
  const difference = input.price - categoryAverage;
  const percentageDiff = categoryAverage > 0 ? (difference / categoryAverage) * 100 : 0;
  
  // Calculate savings (negative means user pays MORE than average)
  const savingsAmount = categoryAverage - input.price;
  // Assume 2 purchases per week, 52 weeks = 104 purchases per year
  const annualSavingsEstimate = savingsAmount * 104;
  
  let position: 'above' | 'below' | 'average';
  if (Math.abs(percentageDiff) <= 10) {
    position = 'average';
  } else if (percentageDiff > 0) {
    position = 'above';
  } else {
    position = 'below';
  }

  // Find cheapest and most expensive from category products
  const allProducts = loadProducts();
  const categoryProducts = allProducts.filter(p => p.categories.includes(input.category));
  const sortedByPrice = [...categoryProducts].sort((a, b) => a.price - b.price);
  
  const cheapestCompetitor = sortedByPrice[0] ? {
    name: sortedByPrice[0].name,
    price: sortedByPrice[0].price,
  } : null;

  const mostExpensiveCompetitor = sortedByPrice[sortedByPrice.length - 1] ? {
    name: sortedByPrice[sortedByPrice.length - 1].name,
    price: sortedByPrice[sortedByPrice.length - 1].price,
  } : null;

  // Generate message with savings context
  let message: string;
  if (position === 'average') {
    message = `Your price is aligned with the category average of RM${categoryAverage.toFixed(2)}.`;
  } else if (position === 'above') {
    message = `Your price is ${Math.abs(percentageDiff).toFixed(0)}% higher than the category average. Customers pay RM${Math.abs(savingsAmount).toFixed(2)} more per purchase.`;
  } else {
    message = `Your price is ${Math.abs(percentageDiff).toFixed(0)}% lower than the category average. Customers save RM${savingsAmount.toFixed(2)} per purchase!`;
  }

  return {
    categoryAverage,
    difference,
    percentageDiff,
    position,
    cheapestCompetitor,
    mostExpensiveCompetitor,
    message,
    savingsAmount,
    annualSavingsEstimate,
  };
}

// Get competitors with test product included
export function getCompetitorsWithTestProduct(
  input: TestProductInput,
  allProducts: Product[]
): CompetitorProduct[] {
  const category = input.category;
  const categoryProducts = allProducts.filter(p => p.categories.includes(category));
  
  // Convert test product to Product and calculate its best value score
  const testProduct = convertToProduct(input);
  const categoryAvgPrice = getCategoryAveragePrice(allProducts, category);
  const testBestValueScore = calculateBestValueScore(testProduct, categoryAvgPrice);
  
  // Map existing products to competitor format
  const competitors: CompetitorProduct[] = categoryProducts.map(p => ({
    id: p.id,
    name: p.name,
    sellerName: p.seller_name,
    price: p.price,
    rating: p.average_rating,
    bestValueScore: p.best_value_score || calculateBestValueScore(p, categoryAvgPrice),
    rank: 0, // Will be calculated after sorting
    isTestProduct: false,
  }));

  // Add test product
  competitors.push({
    id: testProduct.id,
    name: testProduct.name,
    sellerName: testProduct.seller_name,
    price: testProduct.price,
    rating: testProduct.average_rating,
    bestValueScore: testBestValueScore,
    rank: 0,
    isTestProduct: true,
  });

  // Sort by best value score descending
  competitors.sort((a, b) => b.bestValueScore - a.bestValueScore);

  // Assign ranks
  competitors.forEach((c, index) => {
    c.rank = index + 1;
  });

  return competitors;
}

// Calculate predicted ranking
export function calculatePredictedRanking(
  input: TestProductInput,
  competitors: CompetitorProduct[]
): PredictedRanking {
  const testProductCompetitor = competitors.find(c => c.isTestProduct);
  const rank = testProductCompetitor?.rank || competitors.length;
  const totalInCategory = competitors.length;
  const percentile = ((totalInCategory - rank) / totalInCategory) * 100;

  let tier: 'top' | 'middle' | 'bottom';
  if (percentile >= 66) tier = 'top';
  else if (percentile >= 33) tier = 'middle';
  else tier = 'bottom';

  return {
    rank,
    totalInCategory,
    percentile,
    tier,
  };
}

// Unified performance evaluation
function evaluateOverallPerformance(
  bestValueScore: number,
  readinessScore: TestProductReadinessScore,
  predictedRanking: PredictedRanking
): {
  level: 'excellent' | 'good' | 'average' | 'poor';
  bestValueLevel: 'high' | 'medium' | 'low';
  rankLevel: 'top' | 'middle' | 'bottom';
  readinessLevel: 'ready' | 'needs_improvement' | 'not_ready';
  score: number; // Composite score 0-100
} {
  // Normalize best value score to 0-100
  const normalizedBVS = bestValueScore * 100;
  
  // Determine individual levels
  const bestValueLevel = normalizedBVS >= 70 ? 'high' : normalizedBVS >= 50 ? 'medium' : 'low';
  const rankLevel = predictedRanking.tier;
  const readinessLevel = readinessScore.status;
  
  // Calculate composite score (weighted average)
  const score = (
    (normalizedBVS * 0.4) + // 40% weight on Best Value Score
    (readinessScore.overallScore * 0.35) + // 35% weight on Readiness
    ((100 - (predictedRanking.rank / predictedRanking.totalInCategory) * 100) * 0.25) // 25% weight on Ranking
  );
  
  // Determine overall level
  let level: 'excellent' | 'good' | 'average' | 'poor';
  if (score >= 75 && bestValueLevel === 'high' && rankLevel === 'top') {
    level = 'excellent';
  } else if (score >= 60 && (bestValueLevel !== 'low' && rankLevel !== 'bottom')) {
    level = 'good';
  } else if (score >= 40) {
    level = 'average';
  } else {
    level = 'poor';
  }
  
  return {
    level,
    bestValueLevel,
    rankLevel,
    readinessLevel,
    score: Math.round(score)
  };
}

// Generate improvement tips - UNIFIED & CONSISTENT
export function generateImprovementTips(
  input: TestProductInput,
  categoryStats: CategoryStats,
  priceInsight: PriceInsight,
  readinessScore: TestProductReadinessScore,
  predictedRanking: PredictedRanking,
  bestValueScore: number
): ImprovementTip[] {
  const tips: ImprovementTip[] = [];
  
  // Get unified performance evaluation
  const performance = evaluateOverallPerformance(bestValueScore, readinessScore, predictedRanking);
  const normalizedBVS = bestValueScore * 100;

  // === POSITIVE FEEDBACK FIRST (for good/excellent products) ===
  if (performance.level === 'excellent') {
    tips.push({
      type: 'positive',
      title: 'Outstanding Product!',
      description: `Excellent overall performance (Score: ${performance.score}/100). Your product ranks #${predictedRanking.rank} with a strong Best Value Score of ${normalizedBVS.toFixed(0)}. This is a flagship product!`,
      priority: 'low',
      icon: 'Trophy',
    });
  } else if (performance.level === 'good') {
    tips.push({
      type: 'positive',
      title: 'Strong Product Performance',
      description: `Good overall performance (Score: ${performance.score}/100). Your product is competitive with minor room for improvement.`,
      priority: 'low',
      icon: 'CheckCircle',
    });
  }

  // === CRITICAL ISSUES (always show if they exist) ===
  
  // Readiness issues take priority
  if (readinessScore.status === 'not_ready') {
    tips.push({
      type: 'info',
      title: 'Not Ready to List',
      description: `Your product scores ${readinessScore.overallScore}/100 on readiness. Add missing information: ingredients, description, and dietary tags before listing.`,
      priority: 'high',
      icon: 'AlertTriangle',
    });
  } else if (readinessScore.status === 'needs_improvement') {
    tips.push({
      type: 'info',
      title: 'Complete Product Info',
      description: `Readiness score is ${readinessScore.overallScore}/100. Improve by adding more details: ingredients, allergens, and a compelling description.`,
      priority: 'medium',
      icon: 'Info',
    });
  }

  // Ranking issues (only show if performance is not good/excellent)
  if (performance.rankLevel === 'bottom' && performance.level !== 'good' && performance.level !== 'excellent') {
    tips.push({
      type: 'value',
      title: 'Low Predicted Ranking',
      description: `Currently predicted to rank in the bottom ${Math.round(100 - predictedRanking.percentile)}% (Rank #${predictedRanking.rank} of ${predictedRanking.totalInCategory}). Focus on improving taste score, portion size, or reducing price.`,
      priority: 'high',
      icon: 'TrendingDown',
    });
  }

  // === SPECIFIC IMPROVEMENTS ===
  
  // Price competitiveness (only if significantly above average)
  if (priceInsight.percentageDiff > 15) {
    tips.push({
      type: 'price',
      title: 'Price Significantly Above Average',
      description: `Your price is ${priceInsight.percentageDiff.toFixed(0)}% higher than similar products. Consider a price reduction or add a compelling offer to justify the premium.`,
      priority: 'high',
      icon: 'DollarSign',
    });
  } else if (priceInsight.percentageDiff > 5 && performance.level !== 'excellent') {
    tips.push({
      type: 'price',
      title: 'Price Slightly High',
      description: `Your price is ${priceInsight.percentageDiff.toFixed(0)}% above average. Consider a small discount or value-add to improve competitiveness.`,
      priority: 'medium',
      icon: 'DollarSign',
    });
  }
  
  // Price advantage (positive feedback)
  if (priceInsight.percentageDiff < -10 && performance.level !== 'poor') {
    tips.push({
      type: 'positive',
      title: 'Price Advantage',
      description: `Your price is ${Math.abs(priceInsight.percentageDiff).toFixed(0)}% below average. This is a strong competitive advantage!`,
      priority: 'low',
      icon: 'TrendingUp',
    });
  }

  // Quality issues
  if (input.portionScore < 3.0) {
    tips.push({
      type: 'portion',
      title: 'Portion Size Concern',
      description: `Portion score is ${input.portionScore}/5. Users may feel portions are too small. Consider increasing portion size or adjusting price.`,
      priority: 'high',
      icon: 'Utensils',
    });
  } else if (input.portionScore < 3.8 && performance.level !== 'excellent') {
    tips.push({
      type: 'portion',
      title: 'Portion Could Be Improved',
      description: `Portion score is ${input.portionScore}/5. Slightly larger portions could improve customer satisfaction.`,
      priority: 'medium',
      icon: 'Utensils',
    });
  }

  // Taste vs Value mismatch
  if (input.tasteScore >= 4 && input.valueScore < 3.5 && input.tasteScore - input.valueScore > 0.5) {
    tips.push({
      type: 'value',
      title: 'Taste-Value Mismatch',
      description: `Good taste (${input.tasteScore}/5) but low perceived value (${input.valueScore}/5). Add offers or reduce price to match taste quality.`,
      priority: 'high',
      icon: 'BarChart3',
    });
  }

  // Information completeness (lower priority for good products)
  if (input.ingredients.length === 0) {
    tips.push({
      type: 'info',
      title: 'Add Ingredients List',
      description: 'Missing ingredient information reduces buyer confidence and makes it harder for users with dietary restrictions.',
      priority: performance.level === 'poor' ? 'medium' : 'low',
      icon: 'AlertCircle',
    });
  }

  // Dietary tags
  if (!input.isHalal && !input.isVegetarian && !input.isSpicy && input.ingredients.length > 0) {
    tips.push({
      type: 'info',
      title: 'Add Dietary Tags',
      description: 'Add Halal, Vegetarian, or Spicy tags to help users filter and find your product.',
      priority: 'low',
      icon: 'Tag',
    });
  }

  // Offers
  if (!input.hasOffer && performance.level !== 'excellent') {
    tips.push({
      type: 'offer',
      title: 'Consider Adding an Offer',
      description: 'A student discount, bundle deal, or limited-time promotion could boost competitiveness.',
      priority: performance.level === 'poor' ? 'medium' : 'low',
      icon: 'Tag',
    });
  }

  // === SUMMARY TIP FOR POOR PERFORMANCE ===
  if (performance.level === 'poor') {
    tips.push({
      type: 'info',
      title: 'Overall Assessment: Needs Major Improvement',
      description: `Composite score is ${performance.score}/100. Address the high-priority items above to make this product competitive.`,
      priority: 'high',
      icon: 'AlertTriangle',
    });
  }

  return tips;
}

// Main analysis function
export function analyzeTestProduct(input: TestProductInput): ProductAnalysis {
  const allProducts = loadProducts();
  const categoryStats = getCategoryStats(input.category, allProducts);
  
  const readinessScore = calculateTestProductReadinessScore(input, categoryStats);
  const priceInsight = calculatePriceInsight(input, categoryStats);
  const competitors = getCompetitorsWithTestProduct(input, allProducts);
  const predictedRanking = calculatePredictedRanking(input, competitors);
  
  // Calculate best value score and explanation
  const testProduct = convertToProduct(input);
  const categoryAvgPrice = getCategoryAveragePrice(allProducts, input.category);
  const bestValueScore = calculateBestValueScore(testProduct, categoryAvgPrice);
  const bestValueExplanation = calculateBestValueExplanation(input, categoryAvgPrice);

  const improvementTips = generateImprovementTips(
    input,
    categoryStats,
    priceInsight,
    readinessScore,
    predictedRanking,
    bestValueScore // Pass bestValueScore for unified evaluation
  );

  return {
    testProduct: input,
    readinessScore,
    bestValueScore,
    bestValueExplanation,
    predictedRanking,
    priceInsight,
    competitors,
    improvementTips,
    categoryStats,
  };
}
