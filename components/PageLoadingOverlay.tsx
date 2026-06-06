'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Scale } from 'lucide-react';

export function PageLoadingOverlay() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);
    setProgress(0);
    
    // Animate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 12);

    const timer = setTimeout(() => {
      setIsLoading(false);
      clearInterval(progressInterval);
    }, 600);
    
    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm" />
      
      {/* Loading Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center animate-in fade-in duration-300 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
          <div className="flex flex-col items-center gap-5">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center animate-bounce">
              <Scale className="w-10 h-10 text-primary-600 animate-spin" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 animate-pulse">Loading</h2>
              <p className="text-sm text-gray-500 mt-1">Please wait...</p>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-75 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
