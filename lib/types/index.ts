// Location/Seller
export interface Location {
  id: string;
  name: string;
  chain: string;
  position: {
    latitude: number;
    longitude: number;
  };
  address: string;
}

// Review
export interface Review {
  id: string;
  user: string;
  rating: number;
  portion_score: number;
  taste_score: number;
  value_score: number;
  comment: string;
  created_at: string;
}

// Offer/Deal
export interface Offer {
  id: string;
  title: string;
  type: 'discount' | 'bundle' | 'free_item';
  value: number;
  description: string;
  valid_until?: string;
}

// Product
export interface Product {
  id: string;
  location_id: string;
  seller_name: string;
  chain: string;
  name: string;
  description?: string;
  categories: string[];
  product_type: 'food' | 'drink' | 'dessert' | 'side';
  price: number;
  currency: string;
  ingredients: string[];
  options: Record<string, string[]>;
  reviews: Review[];
  average_rating: number;
  review_count: number;
  portion_score: number;
  taste_score: number;
  value_score: number;
  best_value_score?: number; // Added by enrichProductsWithBestValue
  offers: Offer[];
  image_url?: string;
  is_halal: boolean;
  is_vegetarian: boolean;
  allergens: string[];
  created_at: string;
  updated_at: string;
}

// Category metadata
export interface Category {
  id: string;
  name: string;
  parent_id?: string;
  average_price?: number;
}

// Product Readiness Score
export interface ReadinessScore {
  product_id: string;
  overall_score: number;
  status: 'ready' | 'needs_improvement' | 'not_ready';
  breakdown: {
    rating_readiness: number;
    price_competitiveness: number;
    review_confidence: number;
    value_proposition: number;
  };
  recommendations: string[];
}

// Seller Stats
export interface SellerStats {
  total_products: number;
  average_rating: number;
  best_value_products: number;
  total_reviews: number;
}

// Search Filters
export interface SearchFilters {
  categories?: string[];
  chains?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}

// Sort Options
export type SortOption = 'best_value' | 'price_low' | 'price_high' | 'rating' | 'reviews';
