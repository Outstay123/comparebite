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
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search for chicken chop, burger, fries..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          icon={<Search className="w-5 h-5 text-gray-400" />}
          className="flex-1"
        />
        <Button type="submit" size={size}>
          <Search className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
}
