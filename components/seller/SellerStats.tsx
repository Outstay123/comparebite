'use client';

import React from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { SellerStats as SellerStatsType } from '@/lib/types';
import { Package, Star, Award, MessageSquare } from 'lucide-react';

interface SellerStatsProps {
  stats: SellerStatsType;
}

export function SellerStats({ stats }: SellerStatsProps) {
  const items = [
    { icon: Package, label: 'Products', value: stats.total_products },
    { icon: Star, label: 'Avg Rating', value: stats.average_rating.toFixed(1) },
    { icon: Award, label: 'Best Value', value: stats.best_value_products },
    { icon: MessageSquare, label: 'Reviews', value: stats.total_reviews },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardBody className="p-4 text-center">
            <item.icon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{item.value}</div>
            <div className="text-sm text-gray-500">{item.label}</div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
