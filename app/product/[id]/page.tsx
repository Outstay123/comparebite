import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BestValueBadge } from '@/components/product/BestValueBadge';
import { getProductById, loadProducts, enrichProductsWithBestValue } from '@/lib/utils/data';
import { searchProducts } from '@/lib/utils/search';
import { formatPrice, formatRating } from '@/lib/utils/formatters';
import { Star, MapPin, ChevronLeft, Check, AlertCircle } from 'lucide-react';
import { ProductReviewFlow } from '@/components/reviews/ProductReviewFlow';
import { ProductComments } from '@/components/reviews/ProductComments';

// Generate static paths for all products at build time
export function generateStaticParams() {
  const products = loadProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = getProductById(id);
  const allProducts = enrichProductsWithBestValue(loadProducts());

  // Find similar products (same category, different seller)
  const similarProducts = product
    ? searchProducts(allProducts, '', { categories: [product.categories[0]] })
        .filter(p => p.id !== product.id)
        .slice(0, 3)
    : [];

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link href="/" className="inline-block">
            <Button>Go Home</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb - simplified since Navbar handles navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <Link href="/" className="flex items-center text-sm text-gray-600 hover:text-gray-900 w-fit">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardBody className="p-6">
                {/* Image */}
                <div className="w-full h-64 bg-gray-200 rounded-lg mb-6 overflow-hidden flex items-center justify-center">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-lg">{product.name}</span>
                  )}
                </div>

                {/* Title & Badges */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-2" />
                      {product.seller_name}
                    </div>
                  </div>
                  {product.best_value_score && product.best_value_score >= 0.7 && (
                    <BestValueBadge score={product.best_value_score} size="lg" />
                  )}
                </div>

                {/* Price */}
                <div className="text-3xl font-bold text-primary-600 mb-4">
                  {formatPrice(product.price, product.currency)}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center">
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    <span className="ml-2 text-2xl font-bold">{formatRating(product.average_rating)}</span>
                    <span className="text-gray-500 ml-2">/ 5</span>
                  </div>
                  <span className="text-gray-500">({product.review_count * 10} reviews)</span>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-6">{product.description}</p>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.categories.map((cat) => (
                    <Badge key={cat} variant="default">
                      {cat.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>

                {/* Offers */}
                {product.offers.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Active Offers</h3>
                    <div className="space-y-2">
                      {product.offers.map((offer) => (
                        <div key={offer.id} className="bg-primary-50 rounded-lg p-3">
                          <div className="font-medium text-primary-700">{offer.title}</div>
                          <div className="text-sm text-primary-600">{offer.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>

            <ProductComments productId={product.id} initialReviews={product.reviews} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Halal & Dietary */}
            <Card>
              <CardBody className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Dietary Information</h3>
                <div className="space-y-2">
                  {product.is_halal && (
                    <div className="flex items-center text-success-600">
                      <Check className="w-5 h-5 mr-2" />
                      Halal Certified
                    </div>
                  )}
                  {product.is_vegetarian && (
                    <div className="flex items-center text-success-600">
                      <Check className="w-5 h-5 mr-2" />
                      Vegetarian
                    </div>
                  )}
                  {product.allergens.length > 0 && (
                    <div className="flex items-start text-warning-600">
                      <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />
                      <div>
                        <span className="font-medium">Allergens: </span>
                        {product.allergens.join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            <ProductReviewFlow productId={product.id} />

            {/* Similar Products */}
            {similarProducts.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-gray-900">Compare with Similar</h3>
                </CardHeader>
                <CardBody className="p-0">
                  <div className="divide-y divide-gray-100">
                    {similarProducts.map((similar) => (
                      <Link
                        key={similar.id}
                        href={`/compare?ids=${product.id},${similar.id}`}
                        className="flex items-center justify-between p-4 hover:bg-gray-50"
                      >
                        <div>
                          <div className="font-medium text-gray-900">{similar.seller_name}</div>
                          <div className="text-sm text-gray-500">{formatPrice(similar.price, similar.currency)}</div>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="ml-1 text-sm">{formatRating(similar.average_rating)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
