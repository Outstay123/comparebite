import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CompareBite - Find the Best Value Food',
  description: 'Compare food prices, ratings, and value across restaurants. Find the best deals on your favorite dishes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
