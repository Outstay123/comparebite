import { Product } from '@/lib/types';
import { calculateBestValueScore, getCategoryAveragePrice } from './bestValue';
import { calculatePredictedRanking, getCompetitorsWithTestProduct } from './productAnalysis';
import { TestProductInput } from '@/lib/types/productTester';

export interface ProfitInsight {
  sellingPrice: number;
  estimatedCost: number;
  profitPerSale: number;
  profitMargin: number;
  breakEvenUnits: number;
  monthlyProfitEstimate: number; // Assuming 50 sales/month
}

export interface PriceScenario {
  newPrice: number;
  newValueScore: number;
  valueScoreChange: number;
  newProfitPerSale: number;
  profitChange: number;
  estimatedNewRank: number;
  rankChange: number;
  recommendation: string;
  label?: string;
}

export interface CompetitivenessStatus {
  vsAverage: number;
  percentageDiff: number;
  status: 'cheaper' | 'similar' | 'premium' | 'expensive';
  riskLevel: 'low' | 'medium' | 'high';
  message: string;
}

/**
 * Calculate profit insights for a product
 * Uses simple 60% cost assumption for demo purposes
 */
export function calculateProfitInsight(
  price: number,
  monthlySalesEstimate: number = 50
): ProfitInsight {
  // Estimate cost as 60% of selling price (simplified for demo)
  const estimatedCost = price * 0.6;
  const profitPerSale = price - estimatedCost;
  const profitMargin = (profitPerSale / price) * 100;
  
  // Break-even calculation (assuming fixed costs of RM500/month for demo)
  const monthlyFixedCosts = 500;
  const breakEvenUnits = Math.ceil(monthlyFixedCosts / profitPerSale);
  
  // Monthly profit estimate
  const monthlyProfitEstimate = (profitPerSale * monthlySalesEstimate) - monthlyFixedCosts;

  return {
    sellingPrice: price,
    estimatedCost,
    profitPerSale,
    profitMargin,
    breakEvenUnits,
    monthlyProfitEstimate,
  };
}

/**
 * Simulate price change scenario
 * Shows how price affects value score, profit, and ranking
 */
export function simulatePriceChange(
  input: TestProductInput,
  newPrice: number,
  allProducts: Product[]
): PriceScenario {
  // Calculate current metrics
  const currentProfit = calculateProfitInsight(input.price);
  
  // Create modified input with new price
  const modifiedInput: TestProductInput = {
    ...input,
    price: newPrice,
  };
  
  // Calculate new value score
  const categoryAvgPrice = getCategoryAveragePrice(allProducts, input.category);
  const testProduct = convertToTestProduct(modifiedInput);
  const newValueScore = calculateBestValueScore(testProduct, categoryAvgPrice);
  
  // Calculate current value score for comparison
  const currentTestProduct = convertToTestProduct(input);
  const currentValueScore = calculateBestValueScore(currentTestProduct, categoryAvgPrice);
  
  // Calculate new profit
  const newProfit = calculateProfitInsight(newPrice);
  
  // Calculate new ranking
  const competitors = getCompetitorsWithTestProduct(modifiedInput, allProducts);
  const newRanking = calculatePredictedRanking(modifiedInput, competitors);
  
  // Calculate current ranking for comparison
  const currentCompetitors = getCompetitorsWithTestProduct(input, allProducts);
  const currentRanking = calculatePredictedRanking(input, currentCompetitors);
  
  // Determine recommendation
  let recommendation: string;
  const profitChange = newProfit.profitPerSale - currentProfit.profitPerSale;
  const rankChange = currentRanking.rank - newRanking.rank; // Positive = improved
  
  if (rankChange > 2 && profitChange > -1) {
    recommendation = `Reduce price by RM${(input.price - newPrice).toFixed(2)} to break into top ${newRanking.rank} ranking with minimal profit impact`;
  } else if (newProfit.profitPerSale < currentProfit.profitPerSale * 0.7) {
    recommendation = `Warning: This price reduces profit by ${((1 - newProfit.profitPerSale / currentProfit.profitPerSale) * 100).toFixed(0)}%. Consider value-add instead of discount`;
  } else if (newValueScore > currentValueScore * 1.1) {
    recommendation = `This price significantly improves value score. Consider bundling or promotion at this level`;
  } else {
    recommendation = `Price change has moderate impact. Test with limited promotion first`;
  }

  return {
    newPrice,
    newValueScore,
    valueScoreChange: newValueScore - currentValueScore,
    newProfitPerSale: newProfit.profitPerSale,
    profitChange: newProfit.profitPerSale - currentProfit.profitPerSale,
    estimatedNewRank: newRanking.rank,
    rankChange: currentRanking.rank - newRanking.rank,
    recommendation,
  };
}

/**
 * Check price competitiveness against category
 */
export function checkCompetitiveness(
  price: number,
  category: string,
  allProducts: Product[]
): CompetitivenessStatus {
  const categoryAvgPrice = getCategoryAveragePrice(allProducts, category);
  const vsAverage = price - categoryAvgPrice;
  const percentageDiff = categoryAvgPrice > 0 ? (vsAverage / categoryAvgPrice) * 100 : 0;
  
  let status: CompetitivenessStatus['status'];
  let riskLevel: CompetitivenessStatus['riskLevel'];
  let message: string;
  
  if (percentageDiff < -15) {
    status = 'cheaper';
    riskLevel = 'low';
    message = `You are ${Math.abs(percentageDiff).toFixed(0)}% cheaper than competitors. Strong value positioning!`;
  } else if (percentageDiff < -5) {
    status = 'similar';
    riskLevel = 'low';
    message = 'Your price is slightly below average. Good competitive position.';
  } else if (percentageDiff <= 10) {
    status = 'similar';
    riskLevel = 'medium';
    message = 'Your price is aligned with market average. Consider differentiation.';
  } else if (percentageDiff <= 25) {
    status = 'premium';
    riskLevel = 'medium';
    message = `Premium pricing at ${percentageDiff.toFixed(0)}% above average. Ensure quality justifies the price.`;
  } else {
    status = 'expensive';
    riskLevel = 'high';
    message = `Warning: ${percentageDiff.toFixed(0)}% above average. High risk of losing customers to competitors.`;
  }

  return {
    vsAverage,
    percentageDiff,
    status,
    riskLevel,
    message,
  };
}

/**
 * Generate pricing recommendations
 */
export function generatePricingRecommendations(
  input: TestProductInput,
  allProducts: Product[]
): string[] {
  const recommendations: string[] = [];
  const competitiveness = checkCompetitiveness(input.price, input.category, allProducts);
  
  // Check competitiveness
  if (competitiveness.riskLevel === 'high') {
    recommendations.push('Reduce price by 10-15% to align with market average and improve conversion');
  }
  
  // Check offer potential
  if (!input.hasOffer && input.price > 12) {
    recommendations.push('Add a student discount (10%) to improve perceived value without full price reduction');
  }
  
  // Check portion justification
  if (input.portionScore >= 4.2 && competitiveness.status === 'premium') {
    recommendations.push('Highlight large portion size in product description to justify premium price');
  }
  
  // Check value gap
  if (input.tasteScore >= 4 && input.valueScore < 3.5) {
    recommendations.push('Taste is good but value perception is low. Add a bundle deal or free side item');
  }
  
  return recommendations;
}

// Helper function to convert TestProductInput to Product-like object
function convertToTestProduct(input: TestProductInput): Product {
  return {
    id: 'test-product',
    location_id: input.sellerName,
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
      id: 'test-offer', 
      title: input.offerType === 'discount' ? `${input.offerValue}% Off` : 'Special Offer', 
      type: input.offerType || 'discount', 
      value: input.offerValue,
      description: input.offerDescription || ''
    }] : [],
    is_halal: input.isHalal,
    is_vegetarian: input.isVegetarian,
    allergens: input.allergens,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
