'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search } from 'lucide-react';

interface SearchBarProps {
  initialValue?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SearchBar({ initialValue = '', size = 'md' }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${sizeStyles[size]}`}>
      <div className="relative max-w-lg mx-auto">
        <div className="flex items-center bg-white rounded-full border border-gray-300 overflow-hidden">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for chicken chop, burger, fries..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-10 pl-12 bg-transparent border-0 text-gray-900 placeholder-gray-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="h-10 px-10 bg-primary-600 hover:bg-primary-700 rounded-full flex items-center justify-center transition-colors"
          >
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </form>
  );
}
