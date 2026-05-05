'use client';

import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  TestProductInput,
  TEST_PRODUCT_CATEGORIES,
  CHAIN_OPTIONS,
} from '@/lib/types/productTester';
import { 
  Utensils, 
  DollarSign, 
  Star, 
  ChefHat, 
  MapPin, 
  Tag,
  Percent,
  MessageSquare,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Info
} from 'lucide-react';

interface ProductTesterFormProps {
  value: TestProductInput;
  onChange: (value: TestProductInput) => void;
  onAnalyze: () => void;
  isAnalyzing?: boolean;
}

export function ProductTesterForm({ 
  value, 
  onChange, 
  onAnalyze,
  isAnalyzing = false 
}: ProductTesterFormProps) {
  
  const handleChange = <K extends keyof TestProductInput>(
    field: K,
    fieldValue: TestProductInput[K]
  ) => {
    onChange({ ...value, [field]: fieldValue });
  };

  const toggleIngredient = (ingredient: string) => {
    const current = value.ingredients;
    if (current.includes(ingredient)) {
      handleChange('ingredients', current.filter(i => i !== ingredient));
    } else {
      handleChange('ingredients', [...current, ingredient]);
    }
  };

  const toggleAllergen = (allergen: string) => {
    const current = value.allergens;
    if (current.includes(allergen)) {
      handleChange('allergens', current.filter(a => a !== allergen));
    } else {
      handleChange('allergens', [...current, allergen]);
    }
  };

  const commonIngredients = ['chicken', 'beef', 'fish', 'rice', 'noodles', 'bread', 'egg', 'cheese', 'milk', 'potato', 'onion', 'garlic', 'tomato', 'lettuce', 'cucumber'];
  const commonAllergens = ['gluten', 'dairy', 'egg', 'soy', 'nuts', 'shellfish', 'sesame'];

  return (
    <Card className="h-full">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <ChefHat className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Product Details</h2>
            <p className="text-sm text-gray-500">Enter your menu item information</p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="p-6 space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <Info className="w-4 h-4" />
            Basic Information
          </h3>
          
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={value.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Spanish Latte"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={value.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {TEST_PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={value.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe your product..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Pricing
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (MYR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.10"
                min="0"
                value={value.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                value={value.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="MYR">MYR</option>
              </select>
            </div>
          </div>
        </div>

        {/* Seller Info */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Seller Information
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seller / Chain <span className="text-red-500">*</span>
            </label>
            <select
              value={value.chain}
              onChange={(e) => {
                handleChange('chain', e.target.value);
                const selected = CHAIN_OPTIONS.find(c => c.value === e.target.value);
                if (selected) {
                  handleChange('sellerName', selected.label + ' Sunway Pyramid');
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {CHAIN_OPTIONS.map((chain) => (
                <option key={chain.value} value={chain.value}>
                  {chain.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store Name
            </label>
            <input
              type="text"
              value={value.sellerName}
              onChange={(e) => handleChange('sellerName', e.target.value)}
              placeholder="e.g., ZUS Coffee Sunway Pyramid"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Quality Scores */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <Star className="w-4 h-4" />
            Quality Scores (1-5)
          </h3>
          
          <div className="space-y-4">
            {/* Portion Score */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Portion Score</label>
                <span className="text-sm font-bold text-primary-600">{value.portionScore}/5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={value.portionScore}
                onChange={(e) => handleChange('portionScore', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <p className="text-xs text-gray-500 mt-1">How generous is the portion size?</p>
            </div>

            {/* Taste Score */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Taste Score</label>
                <span className="text-sm font-bold text-primary-600">{value.tasteScore}/5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={value.tasteScore}
                onChange={(e) => handleChange('tasteScore', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <p className="text-xs text-gray-500 mt-1">How good does it taste?</p>
            </div>

            {/* Value Score */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Value Score</label>
                <span className="text-sm font-bold text-primary-600">{value.valueScore}/5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={value.valueScore}
                onChange={(e) => handleChange('valueScore', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <p className="text-xs text-gray-500 mt-1">Is it worth the price?</p>
            </div>
          </div>
        </div>

        {/* Sample Reviews */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Sample Reviews
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sample Rating
              </label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={value.sampleRating}
                onChange={(e) => handleChange('sampleRating', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sample Review Count
              </label>
              <input
                type="number"
                min="0"
                value={value.sampleReviewCount}
                onChange={(e) => handleChange('sampleReviewCount', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <Utensils className="w-4 h-4" />
            Ingredients
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {commonIngredients.map((ing) => (
              <button
                key={ing}
                onClick={() => toggleIngredient(ing)}
                className={`px-3 py-1 rounded-full text-sm capitalize transition-colors ${
                  value.ingredients.includes(ing)
                    ? 'bg-primary-100 text-primary-700 border border-primary-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                {ing}
              </button>
            ))}
          </div>
          
          <input
            type="text"
            placeholder="Add custom ingredient (press Enter)"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const val = e.currentTarget.value.trim();
                if (val && !value.ingredients.includes(val)) {
                  handleChange('ingredients', [...value.ingredients, val]);
                  e.currentTarget.value = '';
                }
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          
          {value.ingredients.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {value.ingredients.map((ing) => (
                <Badge key={ing} variant="primary" className="capitalize">
                  {ing}
                  <button
                    onClick={() => toggleIngredient(ing)}
                    className="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Allergens */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Allergens
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {commonAllergens.map((allergen) => (
              <button
                key={allergen}
                onClick={() => toggleAllergen(allergen)}
                className={`px-3 py-1 rounded-full text-sm capitalize transition-colors ${
                  value.allergens.includes(allergen)
                    ? 'bg-red-100 text-red-700 border border-red-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                {allergen}
              </button>
            ))}
          </div>
        </div>

        {/* Dietary Tags */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Dietary Information
          </h3>
          
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value.isHalal}
                onChange={(e) => handleChange('isHalal', e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-sm">Halal</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value.isVegetarian}
                onChange={(e) => handleChange('isVegetarian', e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-sm">Vegetarian</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value.isSpicy}
                onChange={(e) => handleChange('isSpicy', e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-sm">Spicy</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value.containsDairy}
                onChange={(e) => {
                  handleChange('containsDairy', e.target.checked);
                  if (e.target.checked && !value.allergens.includes('dairy')) {
                    handleChange('allergens', [...value.allergens, 'dairy']);
                  }
                }}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-sm">Contains Dairy</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value.containsNuts}
                onChange={(e) => {
                  handleChange('containsNuts', e.target.checked);
                  if (e.target.checked && !value.allergens.includes('nuts')) {
                    handleChange('allergens', [...value.allergens, 'nuts']);
                  }
                }}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-sm">Contains Nuts</span>
            </label>
          </div>
        </div>

        {/* Offer */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <Percent className="w-4 h-4" />
            Special Offer
          </h3>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value.hasOffer}
              onChange={(e) => handleChange('hasOffer', e.target.checked)}
              className="w-4 h-4 text-primary-600 rounded"
            />
            <span className="text-sm font-medium">Has Special Offer</span>
          </label>
          
          {value.hasOffer && (
            <div className="space-y-3 pl-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offer Type
                </label>
                <select
                  value={value.offerType}
                  onChange={(e) => handleChange('offerType', e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select type...</option>
                  <option value="discount">Discount (%)</option>
                  <option value="bundle">Bundle Deal</option>
                  <option value="free_item">Free Item</option>
                </select>
              </div>
              
              {value.offerType === 'discount' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Percentage
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={value.offerValue}
                    onChange={(e) => handleChange('offerValue', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offer Description
                </label>
                <input
                  type="text"
                  value={value.offerDescription}
                  onChange={(e) => handleChange('offerDescription', e.target.value)}
                  placeholder="e.g., 10% student discount with valid ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Image URL */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Image
          </h3>
          
          <input
            type="text"
            value={value.imageUrl}
            onChange={(e) => handleChange('imageUrl', e.target.value)}
            placeholder="Image URL (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Analyze Button */}
        <div className="pt-6 border-t border-gray-100">
          <Button
            onClick={onAnalyze}
            disabled={isAnalyzing || !value.name || !value.category}
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                Analyze Product
              </span>
            )}
          </Button>
          
          {(!value.name || !value.category) && (
            <p className="text-xs text-red-500 mt-2 text-center">
              Please fill in Product Name and Category to analyze
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
