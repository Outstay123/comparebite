'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User,
  Search,
  Store,
  FlaskConical,
  BarChart3,
  LogOut,
  ChevronDown,
  Home,
  ArrowRightLeft,
  Trophy,
} from 'lucide-react';

interface ProfileDropdownProps {
  sellerId?: string;
}

export function ProfileDropdown({ sellerId = 'loc_uncle_lim_kopitiam' }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isSellerRoute = pathname?.startsWith('/seller');
  const isConsumerRoute = !isSellerRoute;

  const menuItems = [
    {
      type: 'section',
      label: 'Consumer View',
    },
    {
      type: 'link',
      href: '/',
      icon: Home,
      label: 'Home',
      description: 'Browse all products',
      active: pathname === '/',
    },
    {
      type: 'link',
      href: '/search',
      icon: Search,
      label: 'Search Products',
      description: 'Find specific items',
      active: pathname?.startsWith('/search'),
    },
    {
      type: 'link',
      href: '/compare',
      icon: ArrowRightLeft,
      label: 'Compare Products',
      description: 'Side-by-side comparison',
      active: pathname?.startsWith('/compare'),
    },
    {
      type: 'link',
      href: '/leaderboard',
      icon: Trophy,
      label: 'Leaderboard',
      description: 'Local vs Chain rankings',
      active: pathname?.startsWith('/leaderboard'),
    },
    {
      type: 'divider',
    },
    {
      type: 'section',
      label: 'Seller Tools',
    },
    {
      type: 'link',
      href: `/seller/${sellerId}`,
      icon: Store,
      label: 'Seller Dashboard',
      description: 'Manage your products',
      active: pathname?.startsWith(`/seller/${sellerId}`) && !pathname?.includes('test-product'),
    },
    {
      type: 'link',
      href: '/seller/test-product',
      icon: FlaskConical,
      label: 'Product Tester',
      description: 'Test before listing',
      active: pathname?.startsWith('/seller/test-product'),
    },
    {
      type: 'link',
      href: `/seller/insights?sellerId=${sellerId}`,
      icon: BarChart3,
      label: 'Seller Insights',
      description: 'Profit & optimization',
      active: pathname?.startsWith('/seller/insights'),
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-full transition-all ${
          isOpen ? 'bg-gray-100' : 'hover:bg-gray-50'
        }`}
      >
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-primary-100 border-2 border-primary-200 flex items-center justify-center">
          <span className="text-sm font-bold text-primary-700">CB</span>
        </div>

        {/* Username - hidden on mobile */}
        <div className="hidden sm:flex flex-col items-start mr-2">
          <span className="text-sm font-medium text-gray-900 leading-tight">
            {isSellerRoute ? 'Seller Mode' : 'Demo User'}
          </span>
          <span className="text-xs text-gray-500 leading-tight">
            {isSellerRoute ? 'Business Tools' : 'Consumer View'}
          </span>
        </div>

        {/* Dropdown Arrow */}
        <ChevronDown
          className={`w-4 h-4 text-gray-500 mr-2 hidden sm:block transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-primary-50 to-white border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Demo Profile</p>
                <p className="text-xs text-gray-500">demo@comparebite.app</p>
              </div>
            </div>

            {/* Mode Indicator */}
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  isConsumerRoute
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Home className="w-3 h-3 mr-1" />
                Consumer
              </span>
              <ArrowRightLeft className="w-3 h-3 text-gray-400" />
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  isSellerRoute
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Store className="w-3 h-3 mr-1" />
                Seller
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <div className="py-2">
              <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Consumer View
              </p>
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link
                href="/search"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <Search className="w-4 h-4" />
                Search Products
              </Link>
              <Link
                href="/compare"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <ArrowRightLeft className="w-4 h-4" />
                Compare
              </Link>
              <Link
                href="/leaderboard"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <Trophy className="w-4 h-4" />
                Leaderboard
              </Link>
            </div>

            <div className="h-px bg-gray-200 my-2" />

            <div className="py-2">
              <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Seller Tools
              </p>
              <Link
                href="/seller/loc_uncle_lim_kopitiam"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <Store className="w-4 h-4" />
                Seller Dashboard
              </Link>
              <Link
                href="/seller/test-product"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <FlaskConical className="w-4 h-4" />
                Test Product
              </Link>
              <Link
                href={`/seller/insights?sellerId=loc_uncle_lim_kopitiam`}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <BarChart3 className="w-4 h-4" />
                Seller Insights
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <button
              disabled
              className="flex items-center gap-2 text-gray-400 cursor-not-allowed w-full py-1"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sign Out (Demo)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
