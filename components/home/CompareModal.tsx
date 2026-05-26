'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { getCategoryIcon } from '@/components/compare/QuickCompare';
import { loadProducts, enrichProductsWithBestValue } from '@/lib/utils/data';
import { getProductsByCategory } from '@/lib/product-filters';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CompareType = 'food' | 'drink';
type Step = 'type' | 'category';

const FOOD_CATEGORIES = [
  { id: 'burger', name: 'Burgers' },
  { id: 'chicken_chop', name: 'Chicken Chop' },
  { id: 'nasi_lemak', name: 'Nasi Lemak' },
  { id: 'fried_chicken', name: 'Fried Chicken' },
  { id: 'rice_bowl', name: 'Rice Bowls' },
  { id: 'roti_canai', name: 'Roti Canai' },
];

const DRINK_CATEGORIES = [
  { id: 'coffee', name: 'Coffee' },
  { id: 'milk_tea', name: 'Milk Tea' },
  { id: 'matcha', name: 'Matcha' },
  { id: 'smoothie', name: 'Smoothies' },
  { id: 'chocolate_drink', name: 'Chocolate' },
  { id: 'teh_ais', name: 'Tea' },
];

export function CompareModal({ isOpen, onClose }: CompareModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>('type');
  const [selectedType, setSelectedType] = useState<CompareType | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setStep('type');
      setSelectedType(null);
    }
  }, [isOpen]);

  const handleTypeSelect = (type: CompareType) => {
    setSelectedType(type);
    setStep('category');
  };

  const handleCategorySelect = (categoryId: string) => {
    const allProducts = enrichProductsWithBestValue(loadProducts());
    const categoryProducts = getProductsByCategory(allProducts, categoryId);
    const topProducts = [...categoryProducts]
      .sort((a, b) => (b.best_value_score || 0) - (a.best_value_score || 0))
      .slice(0, 4);
    const ids = topProducts.map((p) => p.id);

    const url =
      ids.length > 0
        ? `/compare?category=${categoryId}&ids=${ids.join(',')}`
        : `/compare?category=${categoryId}`;

    onClose();
    router.push(url);
  };

  const handleBack = () => {
    if (step === 'category') {
      setStep('type');
      setSelectedType(null);
    }
  };

  if (!isOpen) return null;

  const categories =
    selectedType === 'food' ? FOOD_CATEGORIES : selectedType === 'drink' ? DRINK_CATEGORIES : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 id="compare-modal-title" className="text-xl font-bold text-gray-900">
              {step === 'type' ? 'What do you want to compare?' : 'Pick a category'}
            </h2>
            {step === 'category' && selectedType && (
              <p className="text-sm text-gray-500 mt-0.5 capitalize">{selectedType}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 'type' && (
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleTypeSelect('food')}
                className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-gray-200 hover:border-primary-400 hover:bg-primary-50 transition-all"
              >
                <span className="text-4xl" aria-hidden>
                  🍔
                </span>
                <span className="font-semibold text-gray-900 text-lg">Food</span>
              </button>
              <button
                type="button"
                onClick={() => handleTypeSelect('drink')}
                className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-gray-200 hover:border-primary-400 hover:bg-primary-50 transition-all"
              >
                <span className="text-4xl" aria-hidden>
                  🧋
                </span>
                <span className="font-semibold text-gray-900 text-lg">Drinks</span>
              </button>
            </div>
          )}

          {step === 'category' && (
            <>
              <button
                type="button"
                onClick={handleBack}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium mb-4"
              >
                ← Back
              </button>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat.id)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-primary-400 hover:bg-primary-50 transition-all text-center"
                  >
                    <div className="p-2 rounded-lg bg-gray-100">
                      {getCategoryIcon(cat.id, 'w-6 h-6')}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{cat.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
