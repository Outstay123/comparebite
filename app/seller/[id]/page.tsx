import Link from 'next/link';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SellerStats } from '@/components/seller/SellerStats';
import { ReadinessScoreCard } from '@/components/seller/ReadinessScoreCard';
import { ProductRanking } from '@/components/seller/ProductRanking';
import { getProductsByLocation, loadProducts, loadLocations, getLocationById, enrichProductsWithBestValue } from '@/lib/utils/data';
import { getSellerStats, getTopRatedProducts, getWorstRatedProducts, getBestValueProducts, getProductsNeedingImprovement } from '@/lib/utils/seller';
import { calculateReadinessScore } from '@/lib/utils/readiness';
import { getCategoryAveragePrice } from '@/lib/utils/bestValue';
import { ArrowLeft, MapPin, PieChart, Beaker, TrendingUp } from 'lucide-react';

// Generate static paths for all locations at build time
export function generateStaticParams() {
  const locations = loadLocations();
  return locations.map((location) => ({
    id: location.id,
  }));
}

interface SellerDashboardPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SellerDashboardPage({ params }: SellerDashboardPageProps) {
  const { id } = await params;
  const allProducts = enrichProductsWithBestValue(loadProducts());
  const location = getLocationById(id);
  const sellerProducts = getProductsByLocation(id);

  const stats = getSellerStats(sellerProducts);
  const topRated = getTopRatedProducts(sellerProducts, 5);
  const worstRated = getWorstRatedProducts(sellerProducts, 5);
  const bestValue = getBestValueProducts(sellerProducts, 5);
  const needsImprovement = getProductsNeedingImprovement(sellerProducts);

  // Calculate readiness scores
  const readinessScores = sellerProducts.map(product => {
    const category = product.categories[0];
    const categoryAvgPrice = getCategoryAveragePrice(allProducts, category);
    const categoryAvgRating = 4.0; // Simplified
    return {
      product,
      score: calculateReadinessScore(product, categoryAvgRating, categoryAvgPrice)
    };
  }).sort((a, b) => b.score.overall_score - a.score.overall_score);

  const readyCount = readinessScores.filter(r => r.score.status === 'ready').length;
  const needsWorkCount = readinessScores.filter(r => r.score.status === 'needs_improvement').length;
  const notReadyCount = readinessScores.filter(r => r.score.status === 'not_ready').length;

  if (!location) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Seller Not Found</h1>
          <Link href="/" className="inline-block">
            <Button>Go Home</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Seller Header - Simplified without back button (Navbar handles navigation) */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">
                  {location.name.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{location.name}</h1>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  {location.address}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href={`/seller/insights?sellerId=${id}`}>
                <Button variant="outline" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  View Seller Insights
                </Button>
              </Link>
              <Link href="/seller/test-product">
                <Button variant="primary" className="flex items-center gap-2">
                  <Beaker className="w-4 h-4" />
                  Test New Product
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="mb-8">
          <SellerStats stats={stats} />
        </div>

        {/* Empty State - No Products */}
        {sellerProducts.length === 0 && (
          <Card className="mb-8">
            <CardBody className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Beaker className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No products found for this seller yet.
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                This seller dashboard will display products once they are added to the system.
              </p>
              <Link href="/seller/test-product">
                <Button>
                  <Beaker className="w-4 h-4 mr-2" />
                  Test a Product
                </Button>
              </Link>
            </CardBody>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Rankings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProductRanking title="Top Rated" products={topRated} type="top_rated" />
              <ProductRanking title="Best Value" products={bestValue} type="best_value" />
            </div>

            {/* Products Needing Improvement */}
            {needsImprovement.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Products Needing Improvement (&lt; 3.5 rating)
                  </h2>
                </CardHeader>
                <CardBody className="p-0">
                  <div className="divide-y divide-gray-100">
                    {needsImprovement.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="flex items-center justify-between p-4 hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">Rating: {product.average_rating}/5</div>
                        </div>
                        <Badge variant="error">Needs Work</Badge>
                      </Link>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Product Readiness */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Product Readiness</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {readinessScores.slice(0, 4).map(({ product, score }) => (
                  <ReadinessScoreCard
                    key={product.id}
                    score={score}
                    productName={product.name}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Readiness Overview */}
            <Card>
              <CardHeader className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">Readiness Overview</h3>
              </CardHeader>
              <CardBody className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-success-500 rounded-full"></span>
                      <span className="text-gray-700">Ready to List</span>
                    </div>
                    <span className="font-bold text-success-600">{readyCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-warning-500 rounded-full"></span>
                      <span className="text-gray-700">Needs Improvement</span>
                    </div>
                    <span className="font-bold text-warning-600">{needsWorkCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                      <span className="text-gray-700">Not Ready</span>
                    </div>
                    <span className="font-bold text-red-600">{notReadyCount}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    <strong>Tip:</strong> List your top {readyCount} products first to showcase where you win!
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Quick Actions</h3>
              </CardHeader>
              <CardBody className="space-y-3">
                <Link href="/seller/insights">
                  <Button variant="primary" className="w-full">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Profit Insights
                  </Button>
                </Link>
                <Link href="/seller/test-product">
                  <Button variant="outline" className="w-full">
                    <Beaker className="w-4 h-4 mr-2" />
                    Test Product
                  </Button>
                </Link>
              </CardBody>
            </Card>

            {/* Seller Strategy */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Seller Strategy</h3>
              </CardHeader>
              <CardBody className="p-4 space-y-3">
                <div className="bg-primary-50 rounded-lg p-3">
                  <p className="text-sm text-primary-700">
                    <strong>List strategically:</strong> Focus on your {readyCount} "Ready" products first
                  </p>
                </div>
                <div className="bg-warning-50 rounded-lg p-3">
                  <p className="text-sm text-warning-700">
                    <strong>Quick wins:</strong> Improve {needsWorkCount} products that are close to ready
                  </p>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-sm text-red-700">
                    <strong>Fix or remove:</strong> Address {notReadyCount} products scoring below 50%
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
