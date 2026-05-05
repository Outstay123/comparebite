import { Product, Location } from '@/lib/types';
import { loadProducts, loadLocations, getLocationById } from '@/lib/utils/data';

/**
 * Get seller/location by ID
 */
export function getSellerById(sellerId: string): Location | undefined {
  return getLocationById(sellerId);
}

/**
 * Get all products belonging to a specific seller/location
 * Filters by location_id which is the most reliable field
 */
export function getSellerProducts(sellerId: string, products?: Product[]): Product[] {
  const allProducts = products || loadProducts();
  return allProducts.filter(p => p.location_id === sellerId);
}

/**
 * Normalize seller ID from various input formats
 */
export function normalizeSellerId(value: string | null | undefined): string | null {
  if (!value) return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

/**
 * Get seller insights data - filtered to specific seller
 */
export function getSellerInsightsData(sellerId: string, allProducts?: Product[]) {
  const products = allProducts || loadProducts();
  const sellerProducts = getSellerProducts(sellerId, products);
  const seller = getSellerById(sellerId);

  return {
    seller,
    sellerProducts,
    productCount: sellerProducts.length,
    hasProducts: sellerProducts.length > 0,
    isValidSeller: !!seller,
  };
}

/**
 * Validate that insights are showing correct seller data
 * Returns warning message if data seems incorrect
 */
export function validateSellerInsights(
  sellerId: string,
  displayedProductCount: number
): { isValid: boolean; message?: string } {
  const { seller, productCount } = getSellerInsightsData(sellerId);

  if (!seller) {
    return { isValid: false, message: 'Seller not found' };
  }

  if (productCount === 0) {
    return { isValid: false, message: 'No products found for this seller' };
  }

  // If displayed count doesn't match expected count, something is wrong
  if (displayedProductCount > 0 && displayedProductCount !== productCount) {
    return {
      isValid: false,
      message: `Data mismatch: showing ${displayedProductCount} products but expected ${productCount}`,
    };
  }

  return { isValid: true };
}
