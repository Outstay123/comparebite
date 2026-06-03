'use client';

import React, { useEffect } from 'react';
import { SearchFilters } from '@/lib/types';
import { FilterPanel } from './FilterPanel';
import { X } from 'lucide-react';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export function MobileFilterDrawer({ isOpen, onClose, filters, onFiltersChange }: MobileFilterDrawerProps) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 md:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 md:hidden max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        {/* Handle */}
        <div className="sticky top-0 bg-white pt-3 pb-2 px-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto" />
              <h2 className="font-bold text-gray-900 text-lg">Filters</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Filter Content */}
        <div className="p-4">
          <FilterPanel filters={filters} onFiltersChange={onFiltersChange} />
        </div>
      </div>
    </>
  );
}
