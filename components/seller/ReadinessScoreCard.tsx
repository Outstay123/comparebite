'use client';

import React from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ReadinessScore } from '@/lib/types';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface ReadinessScoreCardProps {
  score: ReadinessScore;
  productName: string;
}

export function ReadinessScoreCard({ score, productName }: ReadinessScoreCardProps) {
  const statusConfig = {
    ready: { icon: CheckCircle, color: 'text-success-600', bg: 'bg-success-50', badge: 'success' },
    needs_improvement: { icon: AlertCircle, color: 'text-warning-600', bg: 'bg-warning-50', badge: 'warning' },
    not_ready: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', badge: 'error' },
  };

  const config = statusConfig[score.status];
  const StatusIcon = config.icon;

  return (
    <Card className="overflow-hidden">
      <CardBody className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="font-semibold text-gray-900">{productName}</h4>
            <Badge variant={config.badge as any} className="mt-1 capitalize">
              {score.status.replace(/_/g, ' ')}
            </Badge>
          </div>
          <div className={`p-2 rounded-lg ${config.bg}`}>
            <StatusIcon className={`w-6 h-6 ${config.color}`} />
          </div>
        </div>

        {/* Score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">Overall Score</span>
            <span className="text-lg font-bold text-gray-900">{score.overall_score}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                score.status === 'ready' ? 'bg-success-500' :
                score.status === 'needs_improvement' ? 'bg-warning-500' : 'bg-red-500'
              }`}
              style={{ width: `${score.overall_score}%` }}
            />
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Rating</span>
            <span className="font-medium">{score.breakdown.rating_readiness}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Price</span>
            <span className="font-medium">{score.breakdown.price_competitiveness}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Reviews</span>
            <span className="font-medium">{score.breakdown.review_confidence}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Value</span>
            <span className="font-medium">{score.breakdown.value_proposition}%</span>
          </div>
        </div>

        {/* Recommendations */}
        <div className="border-t border-gray-100 pt-3">
          <p className="text-sm font-medium text-gray-700 mb-2">Recommendations:</p>
          <ul className="space-y-1">
            {score.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-primary-500 mt-0.5">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </CardBody>
    </Card>
  );
}
