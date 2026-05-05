// Types for Seller Product Tester Feature

export interface TestProductInput {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  portionScore: number;
  tasteScore: number;
  valueScore: number;
  sellerName: string;
  chain: string;
  description: string;
  ingredients: string[];
  allergens: string[];
  isHalal: boolean;
  isVegetarian: boolean;
  isSpicy: boolean;
  containsDairy: boolean;
  containsNuts: boolean;
  hasOffer: boolean;
  offerType: 'discount' | 'bundle' | 'free_item' | '';
  offerValue: number;
  offerDescription: string;
  sampleRating: number;
  sampleReviewCount: number;
  imageUrl: string;
}

export interface CategoryStats {
  category: string;
  averagePrice: number;
  productCount: number;
  priceRange: {
    min: number;
    max: number;
  };
  averageRating: number;
  topRatedProduct: {
    name: string;
    price: number;
    rating: number;
  } | null;
  cheapestProduct: {
    name: string;
    price: number;
    rating: number;
  } | null;
}

export interface TestProductReadinessScore {
  overallScore: number;
  status: 'ready' | 'needs_improvement' | 'not_ready';
  breakdown: {
    completeness: number;      // 25% - Product information completeness
    priceCompetitiveness: number;  // 25% - Price competitiveness
    qualityScores: number;     // 30% - Expected quality scores
    differentiation: number;   // 10% - Offer/differentiation
    confidence: number;        // 10% - Review/sample confidence
  };
}

export interface CompetitorProduct {
  id: string;
  name: string;
  sellerName: string;
  price: number;
  rating: number;
  bestValueScore: number;
  rank: number;
  isTestProduct: boolean;
}

export interface PredictedRanking {
  rank: number;
  totalInCategory: number;
  percentile: number;
  tier: 'top' | 'middle' | 'bottom';
}

export interface BestValueExplanation {
  ratingContribution: number;  // 0-30 points from rating
  priceContribution: number; // 0-30 points from price (lower = better)
  portionContribution: number; // 0-20 points from portion
  offerBonus: number;        // 0-15 points from offers
  confidenceBonus: number;   // 0-5 points from review count
  formula: string;
  breakdown: {
    rating: { value: number; max: number; description: string };
    price: { value: number; max: number; description: string };
    portion: { value: number; max: number; description: string };
    offer: { value: number; max: number; description: string };
    confidence: { value: number; max: number; description: string };
  };
}

export interface PriceInsight {
  categoryAverage: number;
  difference: number;
  percentageDiff: number;
  position: 'above' | 'below' | 'average';
  cheapestCompetitor: { name: string; price: number } | null;
  mostExpensiveCompetitor: { name: string; price: number } | null;
  message: string;
  savingsAmount: number; // How much user saves per purchase vs category avg (negative if more expensive)
  annualSavingsEstimate: number; // Estimated annual savings if purchased weekly
}

export interface ImprovementTip {
  type: 'price' | 'portion' | 'taste' | 'value' | 'info' | 'offer' | 'positive';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

export interface ProductAnalysis {
  testProduct: TestProductInput;
  readinessScore: TestProductReadinessScore;
  bestValueScore: number;
  bestValueExplanation: BestValueExplanation;
  predictedRanking: PredictedRanking;
  priceInsight: PriceInsight;
  competitors: CompetitorProduct[];
  improvementTips: ImprovementTip[];
  categoryStats: CategoryStats;
}

export const TEST_PRODUCT_CATEGORIES = [
  { value: 'chicken_chop', label: 'Chicken Chop' },
  { value: 'burger', label: 'Burger' },
  { value: 'fried_chicken', label: 'Fried Chicken' },
  { value: 'nasi_lemak', label: 'Nasi Lemak' },
  { value: 'coffee', label: 'Coffee' },
  { value: 'latte', label: 'Latte' },
  { value: 'drink', label: 'Drink' },
  { value: 'dessert', label: 'Dessert' },
  { value: 'snack', label: 'Snack' },
  { value: 'rice_meal', label: 'Rice Meal' },
  { value: 'western', label: 'Western' },
  { value: 'nuggets', label: 'Nuggets' },
  { value: 'fries', label: 'Fries' },
  { value: 'combo_meal', label: 'Combo Meal' },
  { value: 'onion_rings', label: 'Onion Rings' },
  { value: 'sides', label: 'Sides' },
  { value: 'main_course', label: 'Main Course' },
] as const;

export const CHAIN_OPTIONS = [
  { value: 'mcdonalds', label: "McDonald's" },
  { value: 'kfc', label: 'KFC' },
  { value: 'burger_king', label: 'Burger King' },
  { value: 'marrybrown', label: 'Marrybrown' },
  { value: '4fingers', label: '4Fingers' },
  { value: 'zus_coffee', label: 'ZUS Coffee' },
  { value: 'starbucks', label: 'Starbucks' },
  { value: 'tealive', label: 'Tealive' },
  { value: 'other', label: 'Other' },
] as const;

// Default values for demo
export const DEFAULT_TEST_PRODUCT: TestProductInput = {
  id: 'test_product_' + Date.now(),
  name: 'Spanish Latte',
  category: 'latte',
  price: 11.90,
  currency: 'MYR',
  portionScore: 4,
  tasteScore: 4.5,
  valueScore: 3.8,
  sellerName: 'ZUS Coffee Sunway Pyramid',
  chain: 'zus_coffee',
  description: 'Smooth espresso with condensed milk and fresh milk for a creamy, slightly sweet flavor',
  ingredients: ['espresso', 'milk', 'condensed milk'],
  allergens: ['dairy'],
  isHalal: true,
  isVegetarian: true,
  isSpicy: false,
  containsDairy: true,
  containsNuts: false,
  hasOffer: true,
  offerType: 'discount',
  offerValue: 10,
  offerDescription: '10% student discount with valid student ID',
  sampleRating: 4.3,
  sampleReviewCount: 12,
  imageUrl: '/images/placeholders/latte.jpg',
};
