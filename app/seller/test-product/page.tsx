'use client';

import React, { useState, useEffect } from 'react';
import { ProductTesterForm } from '@/components/seller/ProductTesterForm';
import { ProductAnalysisPanel } from '@/components/seller/ProductAnalysisPanel';
import { 
  TestProductInput, 
  ProductAnalysis, 
  DEFAULT_TEST_PRODUCT 
} from '@/lib/types/productTester';
import { analyzeTestProduct } from '@/lib/utils/productAnalysis';
import { 
  Beaker, 
  Sparkles, 
  Target,
  Info
} from 'lucide-react';

export default function TestProductPage() {
  const [productInput, setProductInput] = useState<TestProductInput>(DEFAULT_TEST_PRODUCT);
  const [analysis, setAnalysis] = useState<ProductAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  // Auto-analyze on mount with default values
  useEffect(() => {
    handleAnalyze();
  }, []);

  const handleAnalyze = () => {
    if (!productInput.name || !productInput.category) {
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate brief delay for better UX
    setTimeout(() => {
      const result = analyzeTestProduct(productInput);
      setAnalysis(result);
      setHasAnalyzed(true);
      setIsAnalyzing(false);
    }, 300);
  };

  // Auto-analyze when form changes (debounced)
  useEffect(() => {
    if (!hasAnalyzed) return;
    
    const timer = setTimeout(() => {
      if (productInput.name && productInput.category) {
        handleAnalyze();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [
    productInput.name,
    productInput.category,
    productInput.price,
    productInput.portionScore,
    productInput.tasteScore,
    productInput.valueScore,
    productInput.hasOffer,
    productInput.offerValue,
    productInput.sampleRating,
    productInput.sampleReviewCount,
    productInput.sellerName,
    productInput.chain,
  ]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Page Header - Simplified (Navbar handles navigation) */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Beaker className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Seller Product Tester</h1>
              <p className="text-sm text-gray-500 hidden sm:block">
                Test your menu item before listing it
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-[1440px] mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">
                Get Instant Product Insights
              </h2>
              <p className="text-sm text-primary-100 max-w-2xl">
                Enter your product details and receive algorithm-based analysis including readiness score,
                predicted ranking, price competitiveness, and actionable improvement tips.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
              <Target className="w-4 h-4" />
              <span className="text-xs font-medium">No registration required</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left: Form */}
          <div>
            <ProductTesterForm
              value={productInput}
              onChange={setProductInput}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
          </div>

          {/* Right: Analysis */}
          <div>
            <ProductAnalysisPanel 
              analysis={analysis} 
              isLoading={isAnalyzing}
            />
          </div>
        </div>

        {/* How It Works */}
        {!hasAnalyzed && (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
              How It Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-primary-600">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Enter Product Details</h4>
                <p className="text-sm text-gray-600">
                  Fill in your product name, price, category, and quality scores
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-primary-600">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Get Instant Analysis</h4>
                <p className="text-sm text-gray-600">
                  Our system calculates readiness, value score, and predicted ranking
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-primary-600">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Improve & List</h4>
                <p className="text-sm text-gray-600">
                  Follow personalized tips to optimize your product before listing
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Scoring Explanation */}
        <div className="mt-8 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">About the Scoring System</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Product Readiness Score (0-100)</h4>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Information completeness: 25%</li>
                    <li>Price competitiveness: 25%</li>
                    <li>Quality scores: 30%</li>
                    <li>Differentiation/offer: 10%</li>
                    <li>Review confidence: 10%</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Best Value Score (0-100)</h4>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Rating quality: 30%</li>
                    <li>Price affordability: 30%</li>
                    <li>Portion satisfaction: 20%</li>
                    <li>Offer bonus: 15%</li>
                    <li>Review confidence: 5%</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Scores are calculated relative to similar products in the same category. 
                Predicted ranking shows where your product would rank among existing competitors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
