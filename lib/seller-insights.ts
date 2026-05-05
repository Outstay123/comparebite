/**
 * Seller Insights Utilities
 * Menu-level profit and optimization insights
 */

import { Product } from './types';
import { loadProducts } from './utils/data';
import { getCategoryAveragePrice } from './utils/bestValue';

// ============================================================
// TYPES
// ============================================================

export interface ProductProfitAnalysis {
  product: Product;
  sellingPrice: number;
  estimatedCost: number;
  profitPerSale: number;
  profitMargin: number;
  estimatedMonthlySales: number;
  monthlyProfit: number;
  valueScore: number;
  categoryAveragePrice: number;
  vsCategoryAverage: number;
  percentageAboveAverage: number;
}

export interface TopOpportunity {
  product: Product;
  analysis: ProductProfitAnalysis;
  opportunityScore: number;
  weaknessReason: string;
  potentialMonthlyGain: number;
  recommendedAction: string;
}

export interface MenuProfitSummary {
  totalEstimatedProfit: number;
  totalEstimatedRevenue: number;
  averageProfitPerProduct: number;
  productCount: number;
  bestProfitProduct: ProductProfitAnalysis | null;
}

export interface LowProfitItem {
  product: Product;
  analysis: ProductProfitAnalysis;
  reason: string;
  suggestedAction: string;
}

export interface OverpricedRisk {
  product: Product;
  analysis: ProductProfitAnalysis;
  riskLevel: 'low' | 'medium' | 'high';
  percentageAboveAverage: number;
  message: string;
}

export interface MenuBalance {
  highValueItems: Product[];
  overpricedItems: Product[];
  lowQualityItems: Product[];
  lowProfitItems: Product[];
  readyProducts: Product[];
  summary: string;
}

export interface PriceSimulation {
  currentPrice: number;
  newPrice: number;
  currentProfit: number;
  newProfit: number;
  currentValueScore: number;
  newValueScore: number;
  recommendation: string;
}

// ============================================================
// CALCULATION FUNCTIONS
// ============================================================

/**
 * Calculate estimated cost (60% of price as default)
 */
export function calculateEstimatedCost(price: number): number {
  return price * 0.6;
}

/**
 * Calculate profit per sale
 */
export function calculateProfitPerSale(price: number): number {
  const cost = calculateEstimatedCost(price);
  return price - cost;
}

/**
 * Estimate monthly sales based on product metrics
 */
export function estimateMonthlySales(product: Product): number {
  // Base on reviews if available
  if (product.reviews && product.reviews.length > 0) {
    const baseSales = Math.min(Math.max(product.reviews.length * 8, 30), 150);
    
    // Adjust based on ratings
    const avgRating = (product.taste_score + product.portion_score + product.value_score) / 3;
    const ratingMultiplier = avgRating >= 4.2 ? 1.3 : avgRating >= 3.8 ? 1.0 : 0.7;
    
    return Math.round(baseSales * ratingMultiplier);
  }
  
  // Fallback based on value score
  const valueScore = product.best_value_score || 50;
  if (valueScore >= 75) return 120;
  if (valueScore >= 60) return 80;
  if (valueScore >= 45) return 50;
  return 35;
}

/**
 * Calculate monthly profit for a product
 */
export function calculateMonthlyProfit(product: Product): number {
  const profitPerSale = calculateProfitPerSale(product.price);
  const monthlySales = estimateMonthlySales(product);
  return profitPerSale * monthlySales;
}

/**
 * Calculate total menu profit from food products
 */
export function calculateTotalMenuProfit(products: Product[]): number {
  return products.reduce((sum, p) => sum + calculateMonthlyProfit(p), 0);
}

/**
 * Analyze profit for a single product
 */
export function analyzeProductProfit(product: Product, allProducts: Product[]): ProductProfitAnalysis {
  const sellingPrice = product.price;
  const estimatedCost = calculateEstimatedCost(sellingPrice);
  const profitPerSale = sellingPrice - estimatedCost;
  const profitMargin = (profitPerSale / sellingPrice) * 100;
  const estimatedMonthlySales = estimateMonthlySales(product);
  const monthlyProfit = profitPerSale * estimatedMonthlySales;
  
  // Get category comparison
  const category = product.categories[0] || 'general';
  const categoryAveragePrice = getCategoryAveragePrice(allProducts, category);
  const vsCategoryAverage = sellingPrice - categoryAveragePrice;
  const percentageAboveAverage = categoryAveragePrice > 0 
    ? (vsCategoryAverage / categoryAveragePrice) * 100 
    : 0;
  
  return {
    product,
    sellingPrice,
    estimatedCost,
    profitPerSale,
    profitMargin,
    estimatedMonthlySales,
    monthlyProfit,
    valueScore: product.best_value_score || 50,
    categoryAveragePrice,
    vsCategoryAverage,
    percentageAboveAverage,
  };
}

/**
 * Calculate opportunity score for a product
 * Higher = bigger improvement potential
 */
export function calculateOpportunityScore(analysis: ProductProfitAnalysis): number {
  // Factors that indicate opportunity:
  // 1. Low value score (room for improvement)
  // 2. Decent monthly sales (worth improving)
  // 3. Above-average pricing (can be optimized)
  
  const valueGap = 100 - analysis.valueScore; // 0-100
  const salesWeight = Math.min(analysis.estimatedMonthlySales / 100, 1.5); // 0-1.5
  const pricingGap = Math.max(analysis.percentageAboveAverage, 0) / 30; // Normalize
  
  return Math.round(valueGap * salesWeight * (1 + pricingGap));
}

/**
 * Detect overpriced risk for a product
 */
export function detectOverpricedRisk(analysis: ProductProfitAnalysis): OverpricedRisk {
  const percentageAboveAverage = analysis.percentageAboveAverage;
  
  let riskLevel: 'low' | 'medium' | 'high';
  let message: string;
  
  if (percentageAboveAverage <= 10) {
    riskLevel = 'low';
    message = 'Price is close to competitors.';
  } else if (percentageAboveAverage <= 20) {
    riskLevel = 'medium';
    message = 'Watch price sensitivity.';
  } else {
    riskLevel = 'high';
    message = 'Customers may choose cheaper alternatives.';
  }
  
  return {
    product: analysis.product,
    analysis,
    riskLevel,
    percentageAboveAverage,
    message,
  };
}

/**
 * Simulate price change and calculate impact
 */
export function simulatePriceChangeImpact(
  analysis: ProductProfitAnalysis, 
  newPrice: number
): PriceSimulation {
  const currentPrice = analysis.sellingPrice;
  const currentProfit = analysis.profitPerSale;
  
  // Calculate new profit
  const newCost = calculateEstimatedCost(newPrice);
  const newProfit = newPrice - newCost;
  
  // Estimate value score change
  const priceDiffPercent = (newPrice - currentPrice) / currentPrice;
  const valueScoreChange = -priceDiffPercent * 40; // Price decrease = value increase
  const newValueScore = Math.max(0, Math.min(100, analysis.valueScore + valueScoreChange));
  
  // Generate recommendation
  let recommendation: string;
  const profitChange = newProfit - currentProfit;
  const valueImprovement = newValueScore - analysis.valueScore;
  
  if (valueImprovement > 10 && profitChange > -0.5) {
    recommendation = 'This price adjustment significantly improves value score with minimal profit impact. Recommended!';
  } else if (newProfit < currentProfit * 0.6) {
    recommendation = 'Warning: This reduces profit too much. Consider adding value instead of discounting.';
  } else if (valueImprovement > 5) {
    recommendation = 'Good balance of value improvement and profit retention.';
  } else if (valueImprovement < -5) {
    recommendation = 'Price increase may hurt competitiveness. Ensure quality justifies it.';
  } else {
    recommendation = 'Limited impact. Consider other optimization strategies.';
  }
  
  return {
    currentPrice,
    newPrice,
    currentProfit,
    newProfit,
    currentValueScore: analysis.valueScore,
    newValueScore,
    recommendation,
  };
}

// ============================================================
// FEATURE FUNCTIONS
// ============================================================

/**
 * Find the top opportunity product
 */
export function findTopOpportunity(allProducts: Product[]): TopOpportunity | null {
  const analyses = allProducts.map(p => analyzeProductProfit(p, allProducts));
  
  // Score each product
  const scored = analyses.map(analysis => ({
    analysis,
    opportunityScore: calculateOpportunityScore(analysis),
    risk: detectOverpricedRisk(analysis),
  }));
  
  // Sort by opportunity score
  scored.sort((a, b) => b.opportunityScore - a.opportunityScore);
  
  const top = scored[0];
  if (!top) return null;
  
  // Determine weakness reason
  let weaknessReason: string;
  if (top.risk.percentageAboveAverage > 20) {
    weaknessReason = `Price is ${Math.round(top.risk.percentageAboveAverage)}% above category average`;
  } else if (top.analysis.valueScore < 50) {
    weaknessReason = 'Low value score compared to competitors';
  } else if (top.analysis.profitMargin < 30) {
    weaknessReason = 'Low profit margin limits optimization flexibility';
  } else {
    weaknessReason = 'Opportunity to improve competitiveness';
  }
  
  // Calculate potential gain
  const potentialMonthlyGain = top.analysis.monthlyProfit * 0.2; // Assume 20% improvement
  
  // Generate recommended action
  let recommendedAction: string;
  if (top.risk.percentageAboveAverage > 15) {
    recommendedAction = `Reduce price by RM${(top.analysis.vsCategoryAverage * 0.5).toFixed(2)} or add a bundle offer`;
  } else if (top.analysis.valueScore < 60) {
    recommendedAction = 'Add a free side or drink to improve value perception';
  } else {
    recommendedAction = 'Highlight unique selling points to justify pricing';
  }
  
  return {
    product: top.analysis.product,
    analysis: top.analysis,
    opportunityScore: top.opportunityScore,
    weaknessReason,
    potentialMonthlyGain,
    recommendedAction,
  };
}

/**
 * Calculate menu profit summary
 */
export function calculateMenuProfitSummary(allProducts: Product[]): MenuProfitSummary {
  const analyses = allProducts.map(p => analyzeProductProfit(p, allProducts));
  
  const totalEstimatedProfit = analyses.reduce((sum, a) => sum + a.monthlyProfit, 0);
  const totalEstimatedRevenue = analyses.reduce((sum, a) => sum + (a.sellingPrice * a.estimatedMonthlySales), 0);
  const averageProfitPerProduct = analyses.length > 0 ? totalEstimatedProfit / analyses.length : 0;
  
  // Find best profit product
  const sortedByProfit = [...analyses].sort((a, b) => b.monthlyProfit - a.monthlyProfit);
  const bestProfitProduct = sortedByProfit[0] || null;
  
  return {
    totalEstimatedProfit,
    totalEstimatedRevenue,
    averageProfitPerProduct,
    productCount: allProducts.length,
    bestProfitProduct,
  };
}

/**
 * Find low profit items
 */
export function findLowProfitItems(allProducts: Product[]): LowProfitItem[] {
  const analyses = allProducts.map(p => analyzeProductProfit(p, allProducts));
  
  const lowProfitThreshold = 80; // RM80/month
  
  return analyses
    .filter(a => a.monthlyProfit < lowProfitThreshold)
    .sort((a, b) => a.monthlyProfit - b.monthlyProfit)
    .map(analysis => {
      // Determine reason
      let reason: string;
      if (analysis.profitPerSale < 2) {
        reason = 'Low profit per sale';
      } else if (analysis.estimatedMonthlySales < 40) {
        reason = 'Low estimated sales volume';
      } else if (analysis.valueScore < 50) {
        reason = 'Weak value score affecting demand';
      } else {
        reason = 'Combination of low margin and volume';
      }
      
      // Determine suggested action
      let suggestedAction: string;
      if (analysis.profitPerSale < 2) {
        suggestedAction = 'Increase perceived value to justify higher price';
      } else if (analysis.estimatedMonthlySales < 40) {
        suggestedAction = 'Bundle with popular items to increase visibility';
      } else if (analysis.valueScore < 50) {
        suggestedAction = 'Improve portion size or add a side dish';
      } else {
        suggestedAction = 'Consider removing or major repositioning';
      }
      
      return {
        product: analysis.product,
        analysis,
        reason,
        suggestedAction,
      };
    });
}

/**
 * Calculate optimization impact from improving low profit items
 */
export function calculateOptimizationImpact(lowProfitItems: LowProfitItem[]): number {
  if (lowProfitItems.length === 0) return 0;
  
  // Take bottom 2 items
  const bottomItems = lowProfitItems.slice(0, 2);
  
  // Estimate 15-30% improvement potential
  const potentialIncrease = bottomItems.reduce((sum, item) => {
    const improvementRate = 0.2; // 20% improvement
    return sum + (item.analysis.monthlyProfit * improvementRate);
  }, 0);
  
  return potentialIncrease;
}

/**
 * Find overpriced risk items
 */
export function findOverpricedRisks(allProducts: Product[]): OverpricedRisk[] {
  const analyses = allProducts.map(p => analyzeProductProfit(p, allProducts));
  
  return analyses
    .filter(a => a.percentageAboveAverage > 5) // At least slightly above average
    .map(a => detectOverpricedRisk(a))
    .sort((a, b) => b.percentageAboveAverage - a.percentageAboveAverage);
}

/**
 * Calculate menu balance
 */
export function calculateMenuBalance(allProducts: Product[]): MenuBalance {
  const highValueItems = allProducts.filter(p => (p.best_value_score || 0) >= 75);
  
  const analyses = allProducts.map(p => analyzeProductProfit(p, allProducts));
  const overpricedItems = analyses
    .filter(a => a.percentageAboveAverage > 15)
    .map(a => a.product);
  
  const lowQualityItems = allProducts.filter(p => 
    ((p.taste_score + p.portion_score + p.value_score) / 3) < 3.5
  );
  
  const lowProfitItems = analyses
    .filter(a => a.monthlyProfit < 80)
    .map(a => a.product);
  
  // Products with high overall scores considered "ready"
  const readyProducts = allProducts.filter(p => 
    (p.best_value_score || 0) >= 70 && 
    p.average_rating >= 4.0 &&
    p.review_count >= 5
  );
  
  // Generate summary
  let summary: string;
  if (overpricedItems.length >= 3) {
    summary = `Your menu has strong variety, but ${overpricedItems.length} products may feel overpriced compared to alternatives.`;
  } else if (highValueItems.length >= 3) {
    summary = 'Your menu has several high-value items. Focus on promoting these strengths.';
  } else if (lowQualityItems.length >= 2) {
    summary = `${lowQualityItems.length} products have quality concerns that may affect reviews.`;
  } else {
    summary = 'Your menu shows balanced pricing with room for optimization in value perception.';
  }
  
  return {
    highValueItems,
    overpricedItems,
    lowQualityItems,
    lowProfitItems,
    readyProducts,
    summary,
  };
}

/**
 * Get profit by product list (sorted by monthly profit)
 */
export function getProfitByProduct(allProducts: Product[]): ProductProfitAnalysis[] {
  const analyses = allProducts.map(p => analyzeProductProfit(p, allProducts));
  return analyses.sort((a, b) => b.monthlyProfit - a.monthlyProfit);
}
