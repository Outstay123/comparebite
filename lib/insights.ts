/**
 * Shared insights utilities for Consumer Savings and Seller Profit
 * Ensures consistency across all scoring and calculation logic
 */

import { Product } from './types';
import { loadProducts } from './utils/data';
import { calculateBestValueScore, getCategoryAveragePrice } from './utils/bestValue';
import { TestProductInput } from './types/productTester';

// ============================================================
// CONSUMER SAVINGS INSIGHTS
// ============================================================

export interface CategorySavings {
  category: string;
  averagePrice: number;
  bestValuePrice: number;
  bestValueProduct: Product | null;
  savingsPerMeal: number;
  monthlySavings: number;
  productCount: number;
}


export interface SavingsOverview {
  totalCategories: number;
  averageSavingsPerMeal: number;
  topSavingCategory: CategorySavings | null;
  allCategories: CategorySavings[];
}

/**
 * Calculate savings for all categories
 */
export function calculateAllCategorySavings(): CategorySavings[] {
  const products = loadProducts();
  
  // Get all unique categories
  const categories = [...new Set(products.flatMap(p => p.categories))];
  
  return categories.map(category => {
    const categoryProducts = products.filter(p => p.categories.includes(category));
    
    if (categoryProducts.length === 0) return null;
    
    const totalPrice = categoryProducts.reduce((sum, p) => sum + p.price, 0);
    const averagePrice = totalPrice / categoryProducts.length;
    
    // Find best value product
    const sortedByValue = [...categoryProducts].sort(
      (a, b) => (b.best_value_score || 0) - (a.best_value_score || 0)
    );
    const bestValueProduct = sortedByValue[0];
    const bestValuePrice = bestValueProduct?.price || averagePrice;
    
    const savingsPerMeal = averagePrice - bestValuePrice;
    const monthlySavings = savingsPerMeal * 20; // 20 meals per month
    
    const result: CategorySavings = {
      category,
      averagePrice,
      bestValuePrice,
      bestValueProduct: bestValueProduct || null,
      savingsPerMeal,
      monthlySavings,
      productCount: categoryProducts.length,
    };
    return result;
  }).filter(cs => cs !== null);
}

/**
 * Get overall savings overview
 */
export function getSavingsOverview(): SavingsOverview {
  const allSavings = calculateAllCategorySavings();
  
  if (allSavings.length === 0) {
    return {
      totalCategories: 0,
      averageSavingsPerMeal: 0,
      topSavingCategory: null,
      allCategories: [],
    };
  }
  
  const totalSavings = allSavings.reduce((sum, cs) => sum + cs.savingsPerMeal, 0);
  const averageSavingsPerMeal = totalSavings / allSavings.length;
  
  const topSavingCategory = allSavings.reduce((max, cs) => 
    cs.savingsPerMeal > max.savingsPerMeal ? cs : max
  , allSavings[0]);
  
  return {
    totalCategories: allSavings.length,
    averageSavingsPerMeal,
    topSavingCategory,
    allCategories: allSavings.sort((a, b) => b.savingsPerMeal - a.savingsPerMeal),
  };
}

/**
 * Get best value products across all categories
 */
export function getBestValuePicks(limit: number = 5): Product[] {
  const products = loadProducts();
  return products
    .filter(p => (p.best_value_score || 0) > 70)
    .sort((a, b) => (b.best_value_score || 0) - (a.best_value_score || 0))
    .slice(0, limit);
}

// ============================================================
// SELLER PROFIT INSIGHTS
// ============================================================

export interface ProfitAnalysis {
  sellingPrice: number;
  estimatedCost: number;
  profitPerSale: number;
  profitMargin: number;
  monthlyProfitEstimate: number;
  breakEvenUnits: number;
}

export interface PriceSimulationResult {
  newPrice: number;
  newProfitPerSale: number;
  profitChange: number;
  newValueScore: number;
  valueScoreChange: number;
  estimatedNewRank: number;
  rankChange: number;
  recommendation: string;
}

export interface CompetitivenessAnalysis {
  vsAverage: number;
  percentageDiff: number;
  status: 'cheaper' | 'similar' | 'premium' | 'expensive';
  riskLevel: 'low' | 'medium' | 'high';
  message: string;
}

/**
 * Calculate profit analysis for a product
 */
export function calculateProfitAnalysis(price: number): ProfitAnalysis {
  const estimatedCost = price * 0.6;
  const profitPerSale = price - estimatedCost;
  const profitMargin = (profitPerSale / price) * 100;
  const monthlyFixedCosts = 500; // Assumption for demo
  const breakEvenUnits = Math.ceil(monthlyFixedCosts / profitPerSale);
  const monthlyProfitEstimate = (profitPerSale * 50) - monthlyFixedCosts; // 50 sales/month
  
  return {
    sellingPrice: price,
    estimatedCost,
    profitPerSale,
    profitMargin,
    monthlyProfitEstimate,
    breakEvenUnits,
  };
}

/**
 * Simulate price change and its effects
 */
export function simulatePriceChange(
  currentPrice: number,
  newPrice: number,
  currentValueScore: number,
  currentRank: number
): PriceSimulationResult {
  const currentProfit = calculateProfitAnalysis(currentPrice);
  const newProfit = calculateProfitAnalysis(newPrice);
  
  // Estimate value score change (simplified for demo)
  const priceDiffPercent = (newPrice - currentPrice) / currentPrice;
  const valueScoreChange = -priceDiffPercent * 50; // Price decrease = value increase
  const newValueScore = Math.max(0, Math.min(100, currentValueScore + valueScoreChange));
  
  // Estimate rank change (simplified)
  const rankChange = valueScoreChange > 5 ? Math.floor(valueScoreChange / 5) : 
                    valueScoreChange < -5 ? Math.ceil(valueScoreChange / 5) : 0;
  const estimatedNewRank = Math.max(1, currentRank - rankChange);
  
  // Generate recommendation
  let recommendation: string;
  const profitChange = newProfit.profitPerSale - currentProfit.profitPerSale;
  
  if (rankChange >= 2 && profitChange > -1) {
    recommendation = `Reduce price by RM${(currentPrice - newPrice).toFixed(2)} to improve ranking by ${rankChange} positions with minimal profit impact`;
  } else if (newProfit.profitPerSale < currentProfit.profitPerSale * 0.7) {
    recommendation = `Warning: This reduces profit by ${((1 - newProfit.profitPerSale / currentProfit.profitPerSale) * 100).toFixed(0)}%. Consider adding value instead of discounting`;
  } else if (valueScoreChange > 10) {
    recommendation = `Significant value score improvement. Good for promotional pricing`;
  } else {
    recommendation = `Moderate impact. Test with limited-time offer first`;
  }
  
  return {
    newPrice,
    newProfitPerSale: newProfit.profitPerSale,
    profitChange,
    newValueScore,
    valueScoreChange,
    estimatedNewRank,
    rankChange,
    recommendation,
  };
}

/**
 * Analyze competitiveness vs category average
 */
export function analyzeCompetitiveness(
  price: number,
  category: string
): CompetitivenessAnalysis {
  const products = loadProducts();
  const categoryAvgPrice = getCategoryAveragePrice(products, category);
  
  const vsAverage = price - categoryAvgPrice;
  const percentageDiff = categoryAvgPrice > 0 ? (vsAverage / categoryAvgPrice) * 100 : 0;
  
  let status: CompetitivenessAnalysis['status'];
  let riskLevel: CompetitivenessAnalysis['riskLevel'];
  let message: string;
  
  if (percentageDiff < -15) {
    status = 'cheaper';
    riskLevel = 'low';
    message = `${Math.abs(percentageDiff).toFixed(0)}% cheaper than competitors. Excellent value positioning!`;
  } else if (percentageDiff < -5) {
    status = 'similar';
    riskLevel = 'low';
    message = 'Slightly below average. Good competitive position.';
  } else if (percentageDiff <= 10) {
    status = 'similar';
    riskLevel = 'medium';
    message = 'Aligned with market average. Focus on differentiation.';
  } else if (percentageDiff <= 25) {
    status = 'premium';
    riskLevel = 'medium';
    message = `Premium pricing (${percentageDiff.toFixed(0)}% above). Ensure quality justifies price.`;
  } else {
    status = 'expensive';
    riskLevel = 'high';
    message = `Warning: ${percentageDiff.toFixed(0)}% above average. High risk of losing customers.`;
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
 * Generate optimization recommendations for sellers
 */
export function generateSellerRecommendations(
  product: Product,
  competitiveness: CompetitivenessAnalysis
): string[] {
  const recommendations: string[] = [];
  
  if (competitiveness.riskLevel === 'high') {
    recommendations.push(`Reduce price by ${Math.round(competitiveness.percentageDiff / 2)}% to align with market and improve conversion`);
  }
  
  if (product.portion_score && product.portion_score >= 4.2 && competitiveness.status === 'premium') {
    recommendations.push('Highlight generous portion size to justify premium pricing');
  }
  
  if (product.value_score && product.value_score < 3.5 && product.taste_score && product.taste_score >= 4) {
    recommendations.push('Add a bundle deal or free side to improve value perception');
  }
  
  if (!product.offers || product.offers.length === 0) {
    recommendations.push('Add a student discount to attract price-sensitive customers without full price reduction');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Current pricing is competitive. Focus on marketing and customer service.');
  }
  
  return recommendations;
}
