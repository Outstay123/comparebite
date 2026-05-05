'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ProfileDropdown } from './ProfileDropdown';
import { Search, Menu, X, Utensils } from 'lucide-react';

interface NavbarProps {
  sellerId?: string;
}

export function Navbar({ sellerId = 'loc_mcd_sunway' }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Sync search input with URL query
  useEffect(() => {
    const query = searchParams?.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/search');
    }
    setIsMobileMenuOpen(false);
  };

  const isSellerRoute = pathname?.startsWith('/seller');

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Logo */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent hidden sm:block">
                CompareBite
              </span>
            </Link>

            {/* Mobile: Seller badge */}
            {isSellerRoute && (
              <span className="md:hidden inline-flex items-center px-2 py-1 rounded-md bg-purple-100 text-purple-700 text-xs font-medium">
                Seller
              </span>
            )}
          </div>

          {/* Middle: Search Bar - Hidden on mobile, visible on larger screens */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search for chicken chop, burger, coffee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-full text-sm text-gray-900 placeholder-gray-500 focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right: Profile Dropdown & Mobile Menu */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Desktop: Seller mode indicator */}
            {isSellerRoute && (
              <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mr-2">
                Seller Mode
              </span>
            )}

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Search className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Profile Dropdown */}
            <ProfileDropdown sellerId={sellerId} />
          </div>
        </div>

        {/* Mobile Search Bar - Expandable */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-100 animate-in slide-in-from-top-2 duration-150">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-transparent rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all outline-none"
                />
              </div>
            </form>

            {/* Quick Links for Mobile */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === '/'
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Utensils className="w-4 h-4" />
                Home
              </Link>
              <Link
                href="/search"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname?.startsWith('/search')
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Search className="w-4 h-4" />
                Search
              </Link>
              <Link
                href="/compare"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname?.startsWith('/compare')
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Menu className="w-4 h-4" />
                Compare
              </Link>
              <Link
                href={`/seller/${sellerId}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isSellerRoute && !pathname?.includes('test-product')
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Menu className="w-4 h-4" />
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
