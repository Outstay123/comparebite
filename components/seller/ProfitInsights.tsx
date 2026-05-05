'use client';

import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Lightbulb, 
  AlertTriangle,
  Target,
  Calculator,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  ProfitInsight, 
  PriceScenario, 
  CompetitivenessStatus,
  calculateProfitInsight,
  simulatePriceChange,
  checkCompetitiveness,
  generatePricingRecommendations
} from '@/lib/utils/profit';
import { Product } from '@/lib/types';
import { TestProductInput } from '@/lib/types/productTester';
import { loadProducts } from '@/lib/utils/data';

interface ProfitInsightsProps {
  product?: Product;
  testProductInput?: TestProductInput;
  showScenarios?: boolean;
  showRecommendations?: boolean;
}

export function ProfitInsights({
  product,
  testProductInput,
  showScenarios = true,
  showRecommendations = true,
}: ProfitInsightsProps) {
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null);
  
  // Determine price and category based on input type
  const price = product?.price ?? testProductInput?.price ?? 0;
  const category = product?.categories[0] ?? testProductInput?.category ?? '';
  
  // Calculate profit insight
  const profit = calculateProfitInsight(price);
  
  // Check competitiveness
  const allProducts = loadProducts();
  const competitiveness = checkCompetitiveness(price, category, allProducts);
  
  // Generate recommendations
  const recommendations = testProductInput 
    ? generatePricingRecommendations(testProductInput, allProducts)
    : [];
  
  // Generate price scenarios if test product input is provided
  const scenarios: PriceScenario[] = [];
  if (testProductInput && showScenarios) {
    // Scenario 1: 10% price reduction
    const reducedPrice = price * 0.9;
    scenarios.push({
      ...simulatePriceChange(testProductInput, reducedPrice, allProducts),
      label: '10% Discount',
    });
    
    // Scenario 2: Price aligned with average
    const categoryAvg = allProducts
      .filter(p => p.categories.includes(category))
      .reduce((sum, p, _, arr) => sum + p.price / arr.length, 0);
    if (categoryAvg > 0 && Math.abs(price - categoryAvg) > 1) {
      scenarios.push({
        ...simulatePriceChange(testProductInput, categoryAvg, allProducts),
        label: 'Match Category Avg',
      });
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">📈 Profit & Optimization Insights</h3>
          </div>
        </CardHeader>
        <CardBody className="p-4 space-y-4">
          {/* Profit Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="text-xs text-gray-600 mb-1">Profit per Sale</div>
              <div className="text-2xl font-bold text-green-700">
                RM{profit.profitPerSale.toFixed(2)}
              </div>
              <div className="text-xs text-green-600">
                {profit.profitMargin.toFixed(1)}% margin
              </div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="text-xs text-gray-600 mb-1">Monthly Estimate</div>
              <div className="text-2xl font-bold text-blue-700">
                RM{profit.monthlyProfitEstimate.toFixed(0)}
              </div>
              <div className="text-xs text-blue-600">
                ~50 sales/month
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between mb-1">
              <span>Selling Price:</span>
              <span className="font-medium">RM{profit.sellingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Est. Cost (60%):</span>
              <span className="font-medium">RM{profit.estimatedCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-gray-200">
              <span>Profit:</span>
              <span className="font-medium text-green-600">RM{profit.profitPerSale.toFixed(2)}</span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Competitiveness Status */}
      <Card>
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-gray-600" />
            <h4 className="font-medium text-gray-900">Market Position</h4>
          </div>
        </CardHeader>
        <CardBody className="p-4">
          <div className={`p-3 rounded-lg border ${
            competitiveness.riskLevel === 'low' 
              ? 'bg-green-50 border-green-200' 
              : competitiveness.riskLevel === 'medium'
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-2">
              {competitiveness.riskLevel === 'high' ? (
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
              ) : (
                <TrendingUp className={`w-4 h-4 mt-0.5 ${
                  competitiveness.riskLevel === 'low' ? 'text-green-600' : 'text-yellow-600'
                }`} />
              )}
              <div>
                <p className={`font-medium ${
                  competitiveness.riskLevel === 'low' 
                    ? 'text-green-800' 
                    : competitiveness.riskLevel === 'medium'
                    ? 'text-yellow-800'
                    : 'text-red-800'
                }`}>
                  {competitiveness.percentageDiff > 0 ? '+' : ''}{competitiveness.percentageDiff.toFixed(0)}% vs. Category Avg
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {competitiveness.message}
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Price Scenarios */}
      {showScenarios && scenarios.length > 0 && (
        <Card>
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-gray-600" />
              <h4 className="font-medium text-gray-900">Price Change Scenarios</h4>
            </div>
          </CardHeader>
          <CardBody className="p-4">
            <div className="space-y-3">
              {scenarios.map((scenario, index) => (
                <div 
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedScenario(
                      expandedScenario === `scenario-${index}` ? null : `scenario-${index}`
                    )}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{scenario.label}</span>
                      <span className="text-sm text-gray-600">
                        RM{scenario.newPrice.toFixed(2)}
                      </span>
                    </div>
                    {expandedScenario === `scenario-${index}` ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  
                  {expandedScenario === `scenario-${index}` && (
                    <div className="p-3 space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className={`p-2 rounded ${
                          scenario.valueScoreChange >= 0 ? 'bg-green-50' : 'bg-red-50'
                        }`}>
                          <span className="text-gray-600">Value Score:</span>
                          <span className={`ml-1 font-medium ${
                            scenario.valueScoreChange >= 0 ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {scenario.valueScoreChange >= 0 ? '+' : ''}{scenario.valueScoreChange.toFixed(0)}%
                          </span>
                        </div>
                        <div className={`p-2 rounded ${
                          scenario.rankChange > 0 ? 'bg-green-50' : 'bg-gray-50'
                        }`}>
                          <span className="text-gray-600">Ranking:</span>
                          <span className={`ml-1 font-medium ${
                            scenario.rankChange > 0 ? 'text-green-700' : 'text-gray-700'
                          }`}>
                            #{scenario.estimatedNewRank}
                            {scenario.rankChange > 0 && ` (↑${scenario.rankChange})`}
                          </span>
                        </div>
                      </div>
                      <div className={`p-2 rounded ${
                        scenario.profitChange >= 0 ? 'bg-green-50' : 'bg-orange-50'
                      }`}>
                        <span className="text-gray-600">New Profit:</span>
                        <span className={`ml-1 font-medium ${
                          scenario.profitChange >= 0 ? 'text-green-700' : 'text-orange-700'
                        }`}>
                          RM{scenario.newProfitPerSale.toFixed(2)}
                          {scenario.profitChange !== 0 && (
                            <span className="text-xs ml-1">
                              ({scenario.profitChange > 0 ? '+' : ''}RM{scenario.profitChange.toFixed(2)})
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="p-2 bg-blue-50 rounded">
                        <Lightbulb className="w-4 h-4 text-blue-600 inline mr-1" />
                        <span className="text-blue-800">{scenario.recommendation}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Recommendations */}
      {showRecommendations && recommendations.length > 0 && (
        <Card>
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              <h4 className="font-medium text-gray-900">Smart Recommendations</h4>
            </div>
          </CardHeader>
          <CardBody className="p-4">
            <ul className="space-y-2">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

// Helper to add label to scenario
interface ScenarioWithLabel extends PriceScenario {
  label: string;
}
