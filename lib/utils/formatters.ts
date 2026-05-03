export function formatPrice(price: number, currency: string = 'MYR'): string {
  return `${currency} ${price.toFixed(2)}`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`;
}
