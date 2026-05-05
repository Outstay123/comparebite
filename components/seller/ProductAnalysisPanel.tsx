'use client';

import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProductAnalysis, CompetitorProduct, ImprovementTip } from '@/lib/types/productTester';
import {
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Award,
  Info,
  Lightbulb,
  ChevronUp,
  ChevronDown,
  Minus,
  Trophy,
  Target,
  Utensils,
  AlertCircle,
  Tag,
  MapPin,
  Star,
  Users,
  Package,
  Calculator,
  Wallet
} from 'lucide-react';

interface ProductAnalysisPanelProps {
  analysis: ProductAnalysis | null;
  isLoading?: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Award,
  Info,
  Lightbulb,
  Utensils,
  AlertCircle,
  Tag,
  MapPin,
  Star,
  Users,
  Package,
  Trophy,
  Target,
  Calculator,
  Wallet,
};

export function ProductAnalysisPanel({ analysis, isLoading = false }: ProductAnalysisPanelProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Analyzing your product...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl">
        <div className="text-center p-6">
          <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analysis Yet</h3>
          <p className="text-gray-500 max-w-sm">
            Fill in the product details and click &quot;Analyze Product&quot; to see insights, scores, and recommendations.
          </p>
        </div>
      </div>
    );
  }

  const { readinessScore, bestValueScore, predictedRanking, priceInsight, competitors, improvementTips, categoryStats } = analysis;

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-500';
      case 'needs_improvement': return 'bg-yellow-500';
      case 'not_ready': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-50 border-green-200';
      case 'needs_improvement': return 'bg-yellow-50 border-yellow-200';
      case 'not_ready': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-700';
      case 'needs_improvement': return 'text-yellow-700';
      case 'not_ready': return 'text-red-700';
      default: return 'text-gray-700';
    }
  };

  // Get tier badge
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'top': return <Badge variant="success">Top Tier</Badge>;
      case 'middle': return <Badge variant="default">Middle Tier</Badge>;
      case 'bottom': return <Badge variant="error">Bottom Tier</Badge>;
      default: return null;
    }
  };

  // Get rank indicator
  const getRankIndicator = (isTestProduct: boolean, rank: number, testProductRank: number) => {
    if (isTestProduct) {
      return <Badge variant="primary">Your Product</Badge>;
    }
    if (rank < testProductRank) {
      return <ChevronUp className="w-4 h-4 text-green-500" />;
    }
    if (rank > testProductRank) {
      return <ChevronDown className="w-4 h-4 text-red-500" />;
    }
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-100 rounded-lg">
          <BarChart3 className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Product Analysis</h2>
          <p className="text-sm text-gray-500">Data-driven insights for your menu item</p>
        </div>
      </div>

      {/* Scores Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Readiness Score */}
        <Card className={`${getStatusBg(readinessScore.status)} border`}>
          <CardBody className="p-4 text-center">
            <div className="text-sm text-gray-600 mb-1">Readiness Score</div>
            <div className={`text-4xl font-bold ${getStatusText(readinessScore.status)} mb-2`}>
              {readinessScore.overallScore}
            </div>
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(readinessScore.status)} ${getStatusText(readinessScore.status)}`}>
              {readinessScore.status === 'ready' && <CheckCircle className="w-3 h-3" />}
              {readinessScore.status === 'needs_improvement' && <AlertTriangle className="w-3 h-3" />}
              {readinessScore.status === 'not_ready' && <AlertCircle className="w-3 h-3" />}
              {readinessScore.status === 'ready' && 'Ready to List'}
              {readinessScore.status === 'needs_improvement' && 'Needs Work'}
              {readinessScore.status === 'not_ready' && 'Not Ready'}
            </div>
          </CardBody>
        </Card>

        {/* Best Value Score with Explanation */}
        <Card>
          <CardHeader className="border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Best Value Score
            </h3>
          </CardHeader>
          <CardBody className="p-4">
            <div className="text-center mb-4">
              <div className={`text-4xl font-bold mb-1 ${
                bestValueScore >= 0.7 ? 'text-green-600' : 
                bestValueScore >= 0.5 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {(bestValueScore * 100).toFixed(0)}
              </div>
              <div className="text-xs text-gray-500">out of 100</div>
              <p className="text-xs text-gray-600 mt-2 px-2">{analysis.bestValueExplanation.formula}</p>
            </div>
            
            {/* Score Breakdown */}
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-gray-600">Rating Quality</span>
                  <span className="font-medium">{analysis.bestValueExplanation.breakdown.rating.value.toFixed(1)}/{analysis.bestValueExplanation.breakdown.rating.max}</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(analysis.bestValueExplanation.breakdown.rating.value / analysis.bestValueExplanation.breakdown.rating.max) * 100}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-gray-600">Price Affordability</span>
                  <span className="font-medium">{analysis.bestValueExplanation.breakdown.price.value.toFixed(1)}/{analysis.bestValueExplanation.breakdown.price.max}</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${(analysis.bestValueExplanation.breakdown.price.value / analysis.bestValueExplanation.breakdown.price.max) * 100}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-gray-600">Portion Satisfaction</span>
                  <span className="font-medium">{analysis.bestValueExplanation.breakdown.portion.value.toFixed(1)}/{analysis.bestValueExplanation.breakdown.portion.max}</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(analysis.bestValueExplanation.breakdown.portion.value / analysis.bestValueExplanation.breakdown.portion.max) * 100}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-gray-600">Offer Bonus</span>
                  <span className="font-medium">{analysis.bestValueExplanation.breakdown.offer.value.toFixed(1)}/{analysis.bestValueExplanation.breakdown.offer.max}</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(analysis.bestValueExplanation.breakdown.offer.value / analysis.bestValueExplanation.breakdown.offer.max) * 100}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-gray-600">Review Confidence</span>
                  <span className="font-medium">{analysis.bestValueExplanation.breakdown.confidence.value.toFixed(1)}/{analysis.bestValueExplanation.breakdown.confidence.max}</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-pink-400 rounded-full" style={{ width: `${(analysis.bestValueExplanation.breakdown.confidence.value / analysis.bestValueExplanation.breakdown.confidence.max) * 100}%` }} />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Predicted Ranking */}
        <Card>
          <CardBody className="p-4 text-center">
            <div className="text-sm text-gray-600 mb-1">Predicted Rank</div>
            <div className={`text-4xl font-bold mb-2 ${
              predictedRanking.tier === 'top' ? 'text-green-600' :
              predictedRanking.tier === 'middle' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              #{predictedRanking.rank}
            </div>
            <div className="text-xs text-gray-500">
              of {predictedRanking.totalInCategory} in category
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Readiness Breakdown */}
      <Card>
        <CardHeader className="border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Readiness Score Breakdown
          </h3>
        </CardHeader>
        <CardBody className="p-4 space-y-3">
          {[
            { label: 'Information Completeness', score: readinessScore.breakdown.completeness, color: 'bg-blue-500' },
            { label: 'Price Competitiveness', score: readinessScore.breakdown.priceCompetitiveness, color: 'bg-green-500' },
            { label: 'Quality Scores', score: readinessScore.breakdown.qualityScores, color: 'bg-purple-500' },
            { label: 'Differentiation', score: readinessScore.breakdown.differentiation, color: 'bg-orange-500' },
            { label: 'Review Confidence', score: readinessScore.breakdown.confidence, color: 'bg-pink-500' },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{item.label}</span>
                <span className="font-medium">{item.score}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${item.color} transition-all duration-500`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Price Insight */}
      {categoryStats.productCount > 0 && (
        <Card>
          <CardHeader className="border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Price Competitiveness
            </h3>
          </CardHeader>
          <CardBody className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Your Price</div>
                <div className="text-2xl font-bold text-gray-900">
                  RM{analysis.testProduct.price.toFixed(2)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">vs</div>
                <Badge variant={priceInsight.position === 'average' ? 'default' : priceInsight.position === 'below' ? 'success' : 'warning'}>
                  {priceInsight.percentageDiff > 0 ? '+' : ''}{priceInsight.percentageDiff.toFixed(0)}%
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Category Avg</div>
                <div className="text-2xl font-bold text-gray-900">
                  RM{priceInsight.categoryAverage.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Savings Highlight */}
            {priceInsight.savingsAmount !== 0 && (
              <div className={`rounded-lg p-3 ${priceInsight.savingsAmount > 0 ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
                <div className="flex items-center gap-2 mb-1">
                  {priceInsight.savingsAmount > 0 ? (
                    <>
                      <Wallet className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-800">You Save RM{Math.abs(priceInsight.savingsAmount).toFixed(2)} per purchase!</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4 text-orange-600" />
                      <span className="font-semibold text-orange-800">RM{Math.abs(priceInsight.savingsAmount).toFixed(2)} more per purchase</span>
                    </>
                  )}
                </div>
                {priceInsight.annualSavingsEstimate !== 0 && (
                  <p className="text-sm text-gray-600">
                    {priceInsight.savingsAmount > 0 
                      ? <>Estimated annual savings: <span className="font-semibold text-green-700">RM{Math.abs(priceInsight.annualSavingsEstimate).toFixed(0)}</span> (if purchased 2x/week)</>
                      : <>Compared to buying at average price</>
                    }
                  </p>
                )}
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-700">{priceInsight.message}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {priceInsight.cheapestCompetitor && (
                <div>
                  <span className="text-gray-500">Cheapest: </span>
                  <span className="font-medium">{priceInsight.cheapestCompetitor.name}</span>
                  <span className="text-gray-600"> @ RM{priceInsight.cheapestCompetitor.price.toFixed(2)}</span>
                </div>
              )}
              {priceInsight.mostExpensiveCompetitor && (
                <div className="text-right">
                  <span className="text-gray-500">Most Expensive: </span>
                  <span className="font-medium">{priceInsight.mostExpensiveCompetitor?.name}</span>
                  <span className="text-gray-600"> @ RM{priceInsight.mostExpensiveCompetitor.price.toFixed(2)}</span>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Competitor Comparison */}
      {competitors.length > 0 && (
        <Card>
          <CardHeader className="border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Predicted Ranking
              {getTierBadge(predictedRanking.tier)}
            </h3>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-gray-100">
              <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-50 text-xs font-medium text-gray-500">
                <div className="col-span-1">#</div>
                <div className="col-span-5">Product</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">Rating</div>
                <div className="col-span-2 text-right">Score</div>
              </div>
              {competitors.slice(0, 8).map((competitor) => (
                <div 
                  key={competitor.id}
                  className={`grid grid-cols-12 gap-2 px-4 py-3 text-sm items-center ${
                    competitor.isTestProduct ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="col-span-1 font-medium text-gray-900">
                    {competitor.rank}
                  </div>
                  <div className="col-span-5">
                    <div className="font-medium text-gray-900 truncate">
                      {competitor.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {competitor.sellerName}
                    </div>
                  </div>
                  <div className="col-span-2 text-right">
                    RM{competitor.price.toFixed(2)}
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="inline-flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      {competitor.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className={`font-medium ${
                      competitor.bestValueScore >= 0.7 ? 'text-green-600' :
                      competitor.bestValueScore >= 0.5 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {(competitor.bestValueScore * 100).toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {competitors.length > 8 && (
              <div className="px-4 py-2 text-center text-sm text-gray-500 bg-gray-50">
                + {competitors.length - 8} more products in this category
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* Category Stats */}
      {categoryStats.productCount > 0 && (
        <Card>
          <CardHeader className="border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Category Overview
            </h3>
          </CardHeader>
          <CardBody className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{categoryStats.productCount}</div>
                <div className="text-xs text-gray-500">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  RM{categoryStats.averagePrice.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500">Avg Price</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {categoryStats.averageRating.toFixed(1)}
                </div>
                <div className="text-xs text-gray-500">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  RM{categoryStats.priceRange.min.toFixed(0)}-{categoryStats.priceRange.max.toFixed(0)}
                </div>
                <div className="text-xs text-gray-500">Price Range</div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Improvement Tips */}
      {improvementTips.length > 0 && (
        <Card>
          <CardHeader className="border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Improvement Tips
              <span className="text-sm font-normal text-gray-500">
                ({improvementTips.length} suggestions)
              </span>
            </h3>
          </CardHeader>
          <CardBody className="p-4 space-y-3">
            {improvementTips.map((tip, index) => {
              const IconComponent = iconMap[tip.icon] || Info;
              return (
                <div 
                  key={index}
                  className={`flex gap-3 p-3 rounded-lg ${
                    tip.type === 'positive' ? 'bg-green-50 border border-green-200' :
                    tip.priority === 'high' ? 'bg-red-50 border border-red-200' :
                    tip.priority === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className={`flex-shrink-0 ${
                    tip.type === 'positive' ? 'text-green-600' :
                    tip.priority === 'high' ? 'text-red-600' :
                    tip.priority === 'medium' ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{tip.title}</h4>
                      {tip.priority === 'high' && <Badge variant="error">High Priority</Badge>}
                      {tip.priority === 'medium' && <Badge variant="warning">Medium</Badge>}
                      {tip.type === 'positive' && <Badge variant="success">Good</Badge>}
                    </div>
                    <p className="text-sm text-gray-700">{tip.description}</p>
                  </div>
                </div>
              );
            })}
          </CardBody>
        </Card>
      )}

      {/* No Competitors Message */}
      {categoryStats.productCount === 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardBody className="p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800">New Category</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Not enough category data yet. We can still estimate readiness based on product information.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
