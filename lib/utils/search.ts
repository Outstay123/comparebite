import { Product, SearchFilters, SortOption } from '@/lib/types';

export function searchProducts(
  products: Product[],
  query: string,
  filters?: SearchFilters
): Product[] {
  const normalizedQuery = query.toLowerCase().trim();

  return products.filter(product => {
    // Text search: name, categories, seller
    const matchesQuery =
      normalizedQuery === '' ||
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.categories.some(cat => cat.toLowerCase().includes(normalizedQuery)) ||
      product.seller_name.toLowerCase().includes(normalizedQuery) ||
      product.chain.toLowerCase().includes(normalizedQuery);

    // Filters
    const matchesCategory = !filters?.categories ||
      filters.categories.length === 0 ||
      filters.categories.some(cat => product.categories.includes(cat));

    const matchesChain = !filters?.chains ||
      filters.chains.length === 0 ||
      filters.chains.includes(product.chain);

    const matchesPrice =
      (!filters?.minPrice || product.price >= filters.minPrice) &&
      (!filters?.maxPrice || product.price <= filters.maxPrice);

    const matchesRating = !filters?.minRating ||
      product.average_rating >= filters.minRating;

    return matchesQuery && matchesCategory && matchesChain && matchesPrice && matchesRating;
  });
}

export function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const sorted = [...products];

  switch (sortBy) {
    case 'best_value':
      return sorted.sort((a, b) => (b.best_value_score || 0) - (a.best_value_score || 0));
    case 'price_low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.average_rating - a.average_rating);
    case 'reviews':
      return sorted.sort((a, b) => b.review_count - a.review_count);
    default:
      return sorted;
  }
}

export function filterByCategory(products: Product[], category: string): Product[] {
  return products.filter(p => p.categories.includes(category));
}
