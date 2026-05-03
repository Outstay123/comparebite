import { Product, Location } from '@/lib/types';
import productsData from '@/lib/data/products.json';
import locationsData from '@/lib/data/locations.json';

// Re-export from bestValue.ts for convenience
export { enrichProductsWithBestValue } from './bestValue';

export function loadProducts(): Product[] {
  return productsData as unknown as Product[];
}

export function loadLocations(): Location[] {
  return locationsData as unknown as Location[];
}

export function getProductById(id: string): Product | undefined {
  const products = loadProducts();
  return products.find(p => p.id === id);
}

export function getProductsByLocation(locationId: string): Product[] {
  const products = loadProducts();
  return products.filter(p => p.location_id === locationId);
}

export function getLocationById(id: string): Location | undefined {
  const locations = loadLocations();
  return locations.find(l => l.id === id);
}

export function getProductsByChain(chain: string): Product[] {
  const products = loadProducts();
  return products.filter(p => p.chain === chain);
}

export function getAllChains(): string[] {
  const products = loadProducts();
  const chains = products.map(p => p.chain);
  return Array.from(new Set(chains));
}

export function getAllCategories(): string[] {
  const products = loadProducts();
  const categories = products.flatMap(p => p.categories);
  return Array.from(new Set(categories));
}
