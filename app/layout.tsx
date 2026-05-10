import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'CompareBite - Find the Best Value Food',
  description: 'Compare food prices, ratings, and deals across restaurants. Find the best deals on your favorite dishes.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 flex flex-col">
        <Suspense fallback={<div className="h-16 bg-white border-b border-gray-200" />}>
          <Navbar />
        </Suspense>
        {children}
        <Footer />
      </body>
    </html>
  );
}
