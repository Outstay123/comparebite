'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Scale } from 'lucide-react';

export function PageLoadingOverlay() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm" />
      
      {/* Loading Modal */}
      <div className="fixed top-0 left-0 right-0 z-[101] animate-in slide-in-from-top-4 duration-300">
        <div className="max-w-md mx-auto mt-8 bg-white rounded-2xl shadow-2xl p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center">
              <Scale className="w-8 h-8 text-primary-600 animate-pulse" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-bold text-gray-900">Loading</h2>
              <p className="text-sm text-gray-500 mt-1">Please wait...</p>
            </div>
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary-600 animate-pulse" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
