'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, TrendingUp, DollarSign, Calculator, AlertTriangle, 
  Lightbulb, Target, Trophy, BarChart3, PieChart, Search,
  Flame, TrendingDown, CheckCircle, ArrowRight, ChevronDown, ChevronUp,
  Package, Store, ArrowRightLeft
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { loadProducts, loadLocations } from '@/lib/utils/data';
import { Product, Location } from '@/lib/types';
import { normalizeSellerId, getSellerProducts } from '@/lib/seller-utils';
import { getCategoryAveragePrice, calculateBestValueScore } from '@/lib/utils/bestValue';

type TabType = 'opportunity' | 'profit' | 'low-profit' | 'overpriced' | 'simulation' | 'balance' | 'products';

// Constants for calculations
const COST_RATIO = 0.6;
const DEFAULT_MONTHLY_SALES = 50;

// Utility functions
function formatCurrency(amount: number): string {
  return `RM${amount.toFixed(2)}`;
}

function formatCurrencyShort(amount: number): string {
  if (amount >= 1000) {
    return `RM${(amount / 1000).toFixed(1)}k`;
  }
  return `RM${amount.toFixed(0)}`;
}

interface ProductProfitAnalysis {
  product: Product;
  sellingPrice: number;
  estimatedCost: number;
  profitPerSale: number;
  profitMargin: number;
  monthlyProfit: number;
  valueScore: number;
  categoryAvgPrice: number;
  vsCategoryAvg: number;
  riskLevel: 'low' | 'medium' | 'high';
}

function analyzeProductProfit(product: Product, allProducts: Product[]): ProductProfitAnalysis {
  const category = product.categories[0];
  const categoryAvgPrice = getCategoryAveragePrice(allProducts, category);
  const vsCategoryAvg = ((product.price - categoryAvgPrice) / categoryAvgPrice) * 100;
  
  const sellingPrice = product.price;
  const estimatedCost = sellingPrice * COST_RATIO;
  const profitPerSale = sellingPrice - estimatedCost;
  const profitMargin = (profitPerSale / sellingPrice) * 100;
  const monthlyProfit = profitPerSale * DEFAULT_MONTHLY_SALES;
  const valueScore = product.best_value_score || calculateBestValueScore(product, categoryAvgPrice);
  
  let riskLevel: 'low' | 'medium' | 'high';
  if (vsCategoryAvg > 20) riskLevel = 'high';
  else if (vsCategoryAvg > 10) riskLevel = 'medium';
  else riskLevel = 'low';
  
  return {
    product,
    sellingPrice,
    estimatedCost,
    profitPerSale,
    profitMargin,
    monthlyProfit,
    valueScore,
    categoryAvgPrice,
    vsCategoryAvg,
    riskLevel,
  };
}

function findTopOpportunity(products: Product[], allProducts: Product[]) {
  if (products.length === 0) return null;
  
  const analyses = products.map(p => analyzeProductProfit(p, allProducts));
  
  // Find product with highest profit potential but lower value score
  const opportunities = analyses
    .filter(a => a.valueScore < 75 && a.monthlyProfit > 100)
    .sort((a, b) => (b.profitPerSale * (100 - b.valueScore)) - (a.profitPerSale * (100 - a.valueScore)));
  
  const opportunity = opportunities[0] || analyses.sort((a, b) => b.monthlyProfit - a.monthlyProfit)[0];
  
  if (!opportunity) return null;
  
  const potentialGain = opportunity.monthlyProfit * 0.3; // 30% improvement potential
  
  let weaknessReason: string;
  let recommendedAction: string;
  
  if (opportunity.valueScore < 60) {
    weaknessReason = 'Low value perception despite decent profit margin';
    recommendedAction = 'Add bundle deal or improve portion size to boost value score';
  } else if (opportunity.vsCategoryAvg > 15) {
    weaknessReason = 'Overpriced compared to competitors';
    recommendedAction = 'Reduce price by 10-15% to improve competitiveness';
  } else if (opportunity.product.average_rating < 4.0) {
    weaknessReason = 'Low customer satisfaction affecting sales';
    recommendedAction = 'Focus on quality improvement and collect more reviews';
  } else {
    weaknessReason = 'Good product but needs marketing push';
    recommendedAction = 'Highlight unique selling points and run promotion';
  }
  
  return {
    product: opportunity.product,
    analysis: opportunity,
    weaknessReason,
    recommendedAction,
    potentialMonthlyGain: potentialGain,
  };
}

function calculateMenuProfitSummary(products: Product[], allProducts: Product[]) {
  const analyses = products.map(p => analyzeProductProfit(p, allProducts));
  
  const totalMonthlyProfit = analyses.reduce((sum, a) => sum + a.monthlyProfit, 0);
  const totalRevenue = analyses.reduce((sum, a) => sum + (a.sellingPrice * DEFAULT_MONTHLY_SALES), 0);
  const averageProfitPerProduct = totalMonthlyProfit / (products.length || 1);
  
  const sortedByProfit = [...analyses].sort((a, b) => b.monthlyProfit - a.monthlyProfit);
  const bestProfitProduct = sortedByProfit[0];
  const worstProfitProduct = sortedByProfit[sortedByProfit.length - 1];
  
  const categoryProducts = products.filter(p => p.categories.includes(bestProfitProduct.product.categories[0]));
  const totalPrice = categoryProducts.reduce((sum, p) => sum + p.price, 0);
  const categoryAvgPrice = totalPrice / categoryProducts.length;
    
  const productsWithScores = categoryProducts.map(p => ({
    ...p,
    score: calculateBestValueScore(p, categoryAvgPrice)
  }));
  
  const sortedByValue = productsWithScores.sort((a, b) => b.score - a.score);
  const bestValueProduct = sortedByValue[0];
  const bestValuePrice = bestValueProduct?.price || bestProfitProduct.sellingPrice;
  
  return {
    totalEstimatedProfit: totalMonthlyProfit,
    totalEstimatedRevenue: totalRevenue,
    averageProfitPerProduct,
    bestProfitProduct,
    worstProfitProduct,
    productCount: products.length,
  };
}

function findLowProfitItems(products: Product[], allProducts: Product[]) {
  const analyses = products.map(p => analyzeProductProfit(p, allProducts));
  
  return analyses
    .filter(a => a.profitPerSale < 3 || a.profitMargin < 30)
    .sort((a, b) => a.profitPerSale - b.profitPerSale)
    .map(a => ({
      ...a,
      recommendation: a.profitPerSale < 2 
        ? 'Consider removing or significantly repricing'
        : 'Optimize cost structure or increase price slightly',
    }));
}

function calculateOptimizationImpact(lowProfitItems: ReturnType<typeof findLowProfitItems>) {
  const currentTotalLoss = lowProfitItems.reduce((sum, item) => {
    const potentialProfit = 3 - item.profitPerSale; // Target RM3 profit
    return sum + (potentialProfit * DEFAULT_MONTHLY_SALES);
  }, 0);
  
  return {
    itemCount: lowProfitItems.length,
    currentTotalLoss,
    potentialRecovery: currentTotalLoss * 0.6, // 60% recovery is realistic
  };
}

function findOverpricedRisks(products: Product[], allProducts: Product[]) {
  const analyses = products.map(p => analyzeProductProfit(p, allProducts));
  
  return analyses
    .filter(a => a.vsCategoryAvg > 15)
    .sort((a, b) => b.vsCategoryAvg - a.vsCategoryAvg)
    .map(a => ({
      ...a,
      customerLossRisk: a.vsCategoryAvg > 30 ? 'High' : a.vsCategoryAvg > 20 ? 'Medium' : 'Low',
      suggestedPrice: a.categoryAvgPrice * 1.15, // 15% above average is acceptable
    }));
}

function calculateMenuBalance(products: Product[]) {
  const categories = [...new Set(products.flatMap(p => p.categories))];
  const categoryDistribution = categories.map(cat => ({
    category: cat,
    count: products.filter(p => p.categories.includes(cat)).length,
    percentage: 0,
  }));
  
  const total = categoryDistribution.reduce((sum, c) => sum + c.count, 0);
  categoryDistribution.forEach(c => c.percentage = (c.count / total) * 100);
  
  const priceRanges = {
    budget: products.filter(p => p.price < 10).length,
    mid: products.filter(p => p.price >= 10 && p.price < 20).length,
    premium: products.filter(p => p.price >= 20).length,
  };
  
  return {
    categoryDistribution: categoryDistribution.sort((a, b) => b.count - a.count),
    priceRanges,
    diversity: Math.min(categories.length, 10),
  };
}

function SellerInsightsContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('opportunity');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [simulatedPrice, setSimulatedPrice] = useState<number>(0);
  
  const sellerId = normalizeSellerId(searchParams.get('sellerId'));
  const allProducts = loadProducts();
  const locations = loadLocations();
  const seller = sellerId ? locations.find(l => l.id === sellerId) : undefined;
  const sellerProducts = sellerId ? getSellerProducts(sellerId, allProducts) : [];
  
  // Calculate all insights
  const insights = useMemo(() => {
    if (sellerProducts.length === 0) return null;
    
    const topOpportunity = findTopOpportunity(sellerProducts, allProducts);
    const menuProfit = calculateMenuProfitSummary(sellerProducts, allProducts);
    const lowProfitItems = findLowProfitItems(sellerProducts, allProducts);
    const optimizationImpact = calculateOptimizationImpact(lowProfitItems);
    const overpricedRisks = findOverpricedRisks(sellerProducts, allProducts);
    const menuBalance = calculateMenuBalance(sellerProducts);
    
    const profitByProduct = sellerProducts.map(p => analyzeProductProfit(p, allProducts));
    
    return {
      topOpportunity,
      menuProfit,
      lowProfitItems,
      optimizationImpact,
      overpricedRisks,
      menuBalance,
      profitByProduct,
    };
  }, [sellerProducts, allProducts]);
  
  // Set default selected product for simulation
  React.useEffect(() => {
    if (sellerProducts.length > 0 && !selectedProduct) {
      setSelectedProduct(sellerProducts[0]);
      setSimulatedPrice(sellerProducts[0].price);
    }
  }, [sellerProducts, selectedProduct]);
  
  const tabs = [
    { id: 'opportunity' as TabType, label: 'Top Opportunity', icon: Trophy, color: 'orange' },
    { id: 'profit' as TabType, label: 'Menu Profit', icon: DollarSign, color: 'green' },
    { id: 'low-profit' as TabType, label: 'Low Profit Items', icon: TrendingDown, color: 'red' },
    { id: 'overpriced' as TabType, label: 'Overpriced Risk', icon: AlertTriangle, color: 'yellow' },
    { id: 'simulation' as TabType, label: 'Profit vs Value', icon: Calculator, color: 'blue' },
    { id: 'balance' as TabType, label: 'Menu Balance', icon: PieChart, color: 'purple' },
    { id: 'products' as TabType, label: 'All Products', icon: Package, color: 'indigo' },
  ];
  
  const getTabStyles = (tabId: TabType, color: string) => {
    const isActive = activeTab === tabId;
    const colorMap: Record<string, { active: string; inactive: string }> = {
      orange: { active: 'bg-orange-600 text-white border-orange-600', inactive: 'bg-white text-orange-600 border-orange-200 hover:bg-orange-50' },
      green: { active: 'bg-green-600 text-white border-green-600', inactive: 'bg-white text-green-600 border-green-200 hover:bg-green-50' },
      red: { active: 'bg-red-600 text-white border-red-600', inactive: 'bg-white text-red-600 border-red-200 hover:bg-red-50' },
      yellow: { active: 'bg-yellow-500 text-white border-yellow-500', inactive: 'bg-white text-yellow-600 border-yellow-200 hover:bg-yellow-50' },
      blue: { active: 'bg-blue-600 text-white border-blue-600', inactive: 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50' },
      purple: { active: 'bg-purple-600 text-white border-purple-600', inactive: 'bg-white text-purple-600 border-purple-200 hover:bg-purple-50' },
      indigo: { active: 'bg-indigo-600 text-white border-indigo-600', inactive: 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50' },
    };
    
    return isActive ? colorMap[color].active : colorMap[color].inactive;
  };
  
  // Error states
  if (!sellerId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Card className="text-center p-12">
            <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">No Seller Selected</h1>
            <p className="text-gray-500 mb-6">Please select a seller to view their insights.</p>
            <Link href="/search">
              <Button variant="primary">Find Sellers</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Card className="text-center p-12">
            <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Seller Not Found</h1>
            <p className="text-gray-500 mb-6">The seller &quot;{sellerId}&quot; could not be found.</p>
            <Link href="/search">
              <Button variant="primary">Find Sellers</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  if (sellerProducts.length === 0 || !insights) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link href={`/seller/${sellerId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Seller Insights — {seller.name}</h1>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Card className="text-center p-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No Products Found</h2>
            <p className="text-gray-500 mb-6">No products found for {seller.name} yet.</p>
            <Link href={`/seller/${sellerId}`}>
              <Button variant="primary">Back to Dashboard</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between flex-wrap gap-3 md:gap-4">
            <div className="flex items-center gap-2 md:gap-4">
              <Link href={`/seller/${sellerId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-base md:text-xl font-bold text-gray-900">Seller Insights — {seller.name}</h1>
                <p className="text-xs md:text-sm text-gray-500 hidden sm:block">{seller.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-2 md:px-3 py-1 md:py-1.5">
              <Package className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
              <span className="text-xs md:text-sm text-blue-800">
                <strong>{sellerProducts.length}</strong> products
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Tab Navigation */}
        <div className="mb-6 md:mb-8">
          <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 lg:grid-cols-7 md:overflow-visible">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 md:flex-shrink flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 rounded-xl border-2 font-medium transition-all duration-200 text-xs md:text-sm ${getTabStyles(tab.id, tab.color)}`}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* TAB 1: TOP OPPORTUNITY */}
          {activeTab === 'opportunity' && insights.topOpportunity && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <Card className="overflow-hidden border-orange-300">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 md:py-6">
                  <div className="flex items-center gap-2 md:gap-3">
                    <Flame className="w-6 h-6 md:w-8 md:h-8" />
                    <div>
                      <h2 className="text-lg md:text-2xl font-bold">Top Opportunity Product</h2>
                      <p className="text-orange-100 text-xs md:text-base">This product has the biggest potential to improve revenue</p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="p-4 md:p-6">
                  <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">{insights.topOpportunity.product.name}</h3>
                      <p className="text-gray-500 mb-3 md:mb-4 text-sm">{insights.topOpportunity.product.seller_name}</p>
                      <div className="space-y-2 md:space-y-3">
                        <div className="flex justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600 text-xs md:text-sm">Current Profit</span>
                          <span className="font-bold text-gray-900 text-sm md:text-base">{formatCurrency(insights.topOpportunity.analysis.profitPerSale)} per sale</span>
                        </div>
                        <div className="flex justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600 text-xs md:text-sm">Monthly Profit</span>
                          <span className="font-bold text-green-600 text-sm md:text-base">{formatCurrency(insights.topOpportunity.analysis.monthlyProfit)}</span>
                        </div>
                        <div className="flex justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600 text-xs md:text-sm">Value Score</span>
                          <span className="font-bold text-gray-900 text-sm md:text-base">{insights.topOpportunity.analysis.valueScore}/100</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3 md:space-y-4">
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3 md:p-4">
                        <h4 className="font-bold text-red-800 mb-1 md:mb-2 text-sm md:text-base">Main Issue</h4>
                        <p className="text-red-700 text-xs md:text-sm">{insights.topOpportunity.weaknessReason}</p>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-xl p-3 md:p-4">
                        <h4 className="font-bold text-green-800 mb-1 md:mb-2 text-sm md:text-base">Opportunity</h4>
                        <p className="text-green-700 text-xs md:text-sm">
                          If improved, this product could gain <span className="font-bold">{formatCurrency(insights.topOpportunity.potentialMonthlyGain)}/month</span>
                        </p>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 md:p-4">
                        <h4 className="font-bold text-blue-800 mb-1 md:mb-2 text-sm md:text-base">Recommended Action</h4>
                        <p className="text-blue-700 text-xs md:text-sm">{insights.topOpportunity.recommendedAction}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {/* TAB 2: MENU PROFIT */}
          {activeTab === 'profit' && insights.menuProfit && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4 md:space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card className="border-green-200">
                  <CardBody className="p-3 md:p-4 text-center bg-green-50">
                    <p className="text-xs text-green-600 mb-1">Total Profit</p>
                    <p className="text-lg md:text-2xl font-bold text-green-700">{formatCurrencyShort(insights.menuProfit.totalEstimatedProfit)}</p>
                    <p className="text-xs text-green-500">/month</p>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody className="p-3 md:p-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">Revenue</p>
                    <p className="text-lg md:text-2xl font-bold text-gray-900">{formatCurrencyShort(insights.menuProfit.totalEstimatedRevenue)}</p>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody className="p-3 md:p-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">Avg/Product</p>
                    <p className="text-lg md:text-2xl font-bold text-gray-700">{formatCurrency(insights.menuProfit.averageProfitPerProduct)}</p>
                  </CardBody>
                </Card>
                <Card className="border-blue-200">
                  <CardBody className="p-3 md:p-4 text-center bg-blue-50">
                    <p className="text-xs text-blue-600 mb-1">Best Product</p>
                    <p className="text-sm md:text-lg font-bold text-blue-700 truncate">{insights.menuProfit.bestProfitProduct?.product.name || 'N/A'}</p>
                  </CardBody>
                </Card>
              </div>
              
              {/* Mobile Horizontal Cards */}
              <div className="md:hidden flex overflow-x-auto gap-3 pb-4 -mx-4 px-4 snap-x snap-mandatory">
                {insights.profitByProduct.slice(0, 8).map((item) => (
                  <div key={item.product.id} className="flex-shrink-0 w-[280px] snap-start">
                    <Card>
                      <CardBody className="p-3">
                        <h4 className="font-bold text-gray-900 mb-1 text-sm">{item.product.name}</h4>
                        <p className="text-xs text-gray-500 mb-2">{item.product.seller_name}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-500">Price</p>
                            <p className="font-bold">{formatCurrency(item.sellingPrice)}</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-500">Profit</p>
                            <p className="font-bold text-green-600">{formatCurrency(item.profitPerSale)}</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-500">Monthly</p>
                            <p className="font-bold">{formatCurrency(item.monthlyProfit)}</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-500">Value</p>
                            <Badge variant={item.valueScore >= 70 ? 'success' : item.valueScore >= 50 ? 'warning' : 'error'} className="text-xs">
                              {item.valueScore}
                            </Badge>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <Card className="hidden md:block">
                <CardHeader className="border-b border-gray-100 py-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Profit by Product
                  </h3>
                </CardHeader>
                <CardBody className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Product</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Price</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Est. Cost</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Profit/Sale</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Monthly Profit</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Value Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {insights.profitByProduct.slice(0, 8).map((item) => (
                          <tr key={item.product.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <p className="font-medium text-gray-900">{item.product.name}</p>
                              <p className="text-xs text-gray-500">{item.product.seller_name}</p>
                            </td>
                            <td className="px-4 py-3 text-right">{formatCurrency(item.sellingPrice)}</td>
                            <td className="px-4 py-3 text-right text-gray-500">{formatCurrency(item.estimatedCost)}</td>
                            <td className="px-4 py-3 text-right font-medium text-green-600">{formatCurrency(item.profitPerSale)}</td>
                            <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.monthlyProfit)}</td>
                            <td className="px-4 py-3 text-center">
                              <Badge variant={item.valueScore >= 70 ? 'success' : item.valueScore >= 50 ? 'warning' : 'error'}>
                                {item.valueScore}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {/* TAB 3: LOW PROFIT ITEMS */}
          {activeTab === 'low-profit' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4 md:space-y-6">
              {insights.lowProfitItems.length > 0 ? (
                <>
                  <Card className="border-red-200">
                    <CardBody className="p-4 md:p-6 bg-red-50">
                      <div className="flex items-center gap-3 md:gap-4">
                        <TrendingDown className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
                        <div>
                          <h3 className="font-bold text-red-800 text-sm md:text-base">{insights.lowProfitItems.length} Low Profit Items Found</h3>
                          <p className="text-red-600 text-xs md:text-sm">Potential monthly loss: {formatCurrency(insights.optimizationImpact.currentTotalLoss)}</p>
                          <p className="text-xs md:text-sm text-red-500">Realistic recovery potential: {formatCurrency(insights.optimizationImpact.potentialRecovery)}/month</p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                  <div className="grid gap-3 md:gap-4">
                    {insights.lowProfitItems.map((item) => (
                      <Card key={item.product.id} className="border-gray-200">
                        <CardBody className="p-3 md:p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm md:text-base">{item.product.name}</h4>
                              <p className="text-xs md:text-sm text-gray-500">{item.product.seller_name}</p>
                            </div>
                            <Badge variant="error" className="text-xs">Profit: {formatCurrency(item.profitPerSale)}</Badge>
                          </div>
                          <div className="mt-2 md:mt-3 p-2 md:p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <p className="text-xs md:text-sm text-yellow-800"><strong>Recommendation:</strong> {item.recommendation}</p>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <Card className="text-center p-8 md:p-12">
                  <CheckCircle className="w-12 h-12 md:w-16 md:h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">All Products Have Good Profit Margins</h3>
                  <p className="text-gray-500 text-sm md:text-base">No low-profit items found. Your menu is well-optimized!</p>
                </Card>
              )}
            </div>
          )}

          {/* TAB 4: OVERPRICED RISK */}
          {activeTab === 'overpriced' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4 md:space-y-6">
              {insights.overpricedRisks.length > 0 ? (
                <>
                  <Card className="border-yellow-200">
                    <CardBody className="p-4 md:p-6 bg-yellow-50">
                      <div className="flex items-center gap-3 md:gap-4">
                        <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-yellow-600" />
                        <div>
                          <h3 className="font-bold text-yellow-800 text-sm md:text-base">{insights.overpricedRisks.length} Overpriced Risk Items</h3>
                          <p className="text-yellow-600 text-xs md:text-sm">These products are significantly above category average</p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                  <div className="grid gap-3 md:gap-4">
                    {insights.overpricedRisks.map((item) => (
                      <Card key={item.product.id} className={`border-l-4 ${item.vsCategoryAvg > 30 ? 'border-l-red-500' : item.vsCategoryAvg > 20 ? 'border-l-yellow-500' : 'border-l-orange-500'}`}>
                        <CardBody className="p-3 md:p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm md:text-base">{item.product.name}</h4>
                              <p className="text-xs md:text-sm text-gray-500">{formatCurrency(item.sellingPrice)} vs avg {formatCurrency(item.categoryAvgPrice)}</p>
                            </div>
                            <Badge variant={item.vsCategoryAvg > 30 ? 'error' : item.vsCategoryAvg > 20 ? 'warning' : 'default'} className="text-xs">
                              +{item.vsCategoryAvg.toFixed(0)}%
                            </Badge>
                          </div>
                          <div className="mt-2 md:mt-3 grid grid-cols-2 gap-2 md:gap-4">
                            <div className="p-2 md:p-3 bg-red-50 rounded-lg">
                              <p className="text-xs text-red-600">Customer Loss Risk</p>
                              <p className="font-bold text-red-700 text-sm md:text-base">{item.customerLossRisk}</p>
                            </div>
                            <div className="p-2 md:p-3 bg-green-50 rounded-lg">
                              <p className="text-xs text-green-600">Suggested Price</p>
                              <p className="font-bold text-green-700 text-sm md:text-base">{formatCurrency(item.suggestedPrice)}</p>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <Card className="text-center p-8 md:p-12">
                  <CheckCircle className="w-12 h-12 md:w-16 md:h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">No Overpricing Risks</h3>
                  <p className="text-gray-500 text-sm md:text-base">All your products are competitively priced within market range.</p>
                </Card>
              )}
            </div>
          )}

          {/* TAB 5: SIMULATION */}
          {activeTab === 'simulation' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <Card>
                <CardHeader className="border-b border-gray-100 py-3 md:py-4 bg-blue-50">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm md:text-base">
                    <Calculator className="w-4 h-4 md:w-5 md:h-5" />
                    Price Simulation - Profit vs Value Trade-off
                  </h3>
                </CardHeader>
                <CardBody className="p-4 md:p-6">
                  <div className="mb-4 md:mb-6">
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Select Product</label>
                    <select
                      value={selectedProduct?.id || ''}
                      onChange={(e) => {
                        const product = sellerProducts.find(p => p.id === e.target.value);
                        if (product) {
                          setSelectedProduct(product);
                          setSimulatedPrice(product.price);
                        }
                      }}
                      className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      {sellerProducts.map((product) => (
                        <option key={product.id} value={product.id}>{product.name} - {formatCurrency(product.price)}</option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedProduct && (
                    <>
                      <div className="mb-4 md:mb-6">
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                          Simulated Price: {formatCurrency(simulatedPrice)}
                        </label>
                        <input
                          type="range"
                          min={Math.max(1, selectedProduct.price * 0.5)}
                          max={selectedProduct.price * 1.5}
                          step="0.50"
                          value={simulatedPrice}
                          onChange={(e) => setSimulatedPrice(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{formatCurrency(Math.max(1, selectedProduct.price * 0.5))}</span>
                          <span>Current: {formatCurrency(selectedProduct.price)}</span>
                          <span>{formatCurrency(selectedProduct.price * 1.5)}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="p-3 md:p-4 bg-gray-100 rounded-lg">
                          <p className="text-xs md:text-sm font-medium text-gray-700 mb-2">Current</p>
                          <p className="text-xs md:text-sm text-gray-600">Price: {formatCurrency(selectedProduct.price)}</p>
                          <p className="text-xs md:text-sm text-gray-600">Value Score: {selectedProduct.best_value_score || 'N/A'}</p>
                          <p className="text-xs md:text-sm text-gray-600">Est. Profit: {formatCurrency((selectedProduct.price * 0.4))}</p>
                        </div>
                        <div className="p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs md:text-sm font-medium text-blue-700 mb-2">If Price = {formatCurrency(simulatedPrice)}</p>
                          <p className="text-xs md:text-sm text-blue-600">
                            Value Score: ~{Math.max(0, Math.min(100, (selectedProduct.best_value_score || 50) - ((simulatedPrice - selectedProduct.price) / selectedProduct.price) * 50)).toFixed(0)}
                          </p>
                          <p className="text-xs md:text-sm text-blue-600">
                            Est. Profit: {formatCurrency(simulatedPrice * 0.4)}
                          </p>
                          <p className="text-xs md:text-sm text-blue-600">
                            Profit Change: {formatCurrency((simulatedPrice - selectedProduct.price) * 0.4)}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </CardBody>
              </Card>
            </div>
          )}

          {/* TAB 6: MENU BALANCE */}
          {activeTab === 'balance' && insights.menuBalance && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <Card>
                  <CardBody className="p-3 md:p-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">Category Diversity</p>
                    <p className="text-2xl md:text-3xl font-bold text-purple-600">{insights.menuBalance.diversity}</p>
                    <p className="text-xs text-gray-400">unique categories</p>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody className="p-3 md:p-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">Price Range Coverage</p>
                    <div className="flex justify-center gap-1 md:gap-2 text-xs md:text-sm">
                      <span className="text-green-600">{insights.menuBalance.priceRanges.budget} budget</span>
                      <span className="text-gray-400">|</span>
                      <span className="text-blue-600">{insights.menuBalance.priceRanges.mid} mid</span>
                      <span className="text-gray-400">|</span>
                      <span className="text-purple-600">{insights.menuBalance.priceRanges.premium} premium</span>
                    </div>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody className="p-3 md:p-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">Top Category</p>
                    <p className="text-sm md:text-lg font-bold text-gray-900 capitalize">{insights.menuBalance.categoryDistribution[0]?.category.replace(/_/g, ' ') || 'N/A'}</p>
                    <p className="text-xs text-gray-400">{insights.menuBalance.categoryDistribution[0]?.percentage.toFixed(0)}% of menu</p>
                  </CardBody>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="border-b border-gray-100 py-3 md:py-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm md:text-base">
                    <PieChart className="w-4 h-4 md:w-5 md:h-5" />
                    Category Distribution
                  </h3>
                </CardHeader>
                <CardBody className="p-3 md:p-4">
                  <div className="space-y-2 md:space-y-3">
                    {insights.menuBalance.categoryDistribution.map((cat) => (
                      <div key={cat.category} className="flex items-center gap-2 md:gap-3">
                        <div className="w-16 md:w-24 text-xs md:text-sm capitalize truncate">{cat.category.replace(/_/g, ' ')}</div>
                        <div className="flex-1 h-4 md:h-6 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
                            style={{ width: `${cat.percentage}%` }}
                          />
                        </div>
                        <div className="w-12 md:w-16 text-right text-xs md:text-sm font-medium">{cat.count} items</div>
                        <div className="w-8 md:w-12 text-right text-xs md:text-sm text-gray-500">{cat.percentage.toFixed(0)}%</div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {/* TAB 7: ALL PRODUCTS */}
          {activeTab === 'products' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Mobile Horizontal Cards */}
              <div className="md:hidden flex overflow-x-auto gap-3 pb-4 -mx-4 px-4 snap-x snap-mandatory">
                {insights.profitByProduct.map((item) => (
                  <div key={item.product.id} className="flex-shrink-0 w-[280px] snap-start">
                    <Card>
                      <CardBody className="p-3">
                        <h4 className="font-bold text-gray-900 mb-1 text-sm">{item.product.name}</h4>
                        <p className="text-xs text-gray-500 mb-2">{item.product.categories[0]?.replace(/_/g, ' ')}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-500">Price</p>
                            <p className="font-bold">{formatCurrency(item.sellingPrice)}</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-500">Profit</p>
                            <p className={`font-bold ${item.profitPerSale < 3 ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(item.profitPerSale)}</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-500">Value</p>
                            <Badge variant={item.valueScore >= 70 ? 'success' : item.valueScore >= 50 ? 'warning' : 'error'} className="text-xs">
                              {item.valueScore}
                            </Badge>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-500">vs Avg</p>
                            <p className={`font-bold ${item.vsCategoryAvg > 20 ? 'text-red-600' : item.vsCategoryAvg > 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                              {item.vsCategoryAvg > 0 ? '+' : ''}{item.vsCategoryAvg.toFixed(0)}%
                            </p>
                          </div>
                        </div>
                        <Link href={`/product/${item.product.id}`} className="block">
                          <Button variant="outline" size="sm" className="w-full text-xs">View</Button>
                        </Link>
                      </CardBody>
                    </Card>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <Card className="hidden md:block">
                <CardHeader className="border-b border-gray-100 py-4">
                  <h3 className="font-bold text-gray-900">All Products Analysis</h3>
                </CardHeader>
                <CardBody className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Product</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Price</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Profit/Sale</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Value Score</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">vs Avg</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {insights.profitByProduct.map((item) => (
                          <tr key={item.product.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <p className="font-medium text-gray-900">{item.product.name}</p>
                              <p className="text-xs text-gray-500">{item.product.categories[0]?.replace(/_/g, ' ')}</p>
                            </td>
                            <td className="px-4 py-3 text-right">{formatCurrency(item.sellingPrice)}</td>
                            <td className="px-4 py-3 text-right">
                              <span className={item.profitPerSale < 3 ? 'text-red-600' : 'text-green-600'}>
                                {formatCurrency(item.profitPerSale)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Badge variant={item.valueScore >= 70 ? 'success' : item.valueScore >= 50 ? 'warning' : 'error'}>
                                {item.valueScore}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={item.vsCategoryAvg > 20 ? 'text-red-600' : item.vsCategoryAvg > 10 ? 'text-yellow-600' : 'text-green-600'}>
                                {item.vsCategoryAvg > 0 ? '+' : ''}{item.vsCategoryAvg.toFixed(0)}%
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Link href={`/product/${item.product.id}`}>
                                <Button variant="outline" size="sm">View</Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 flex justify-center gap-4">
          <Link href={`/seller/${sellerId}`}>
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense
export default function SellerInsightsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading insights...</p>
        </div>
      </div>
    }>
      <SellerInsightsContent />
    </Suspense>
  );
}
