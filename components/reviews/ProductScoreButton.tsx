'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ProductScoreButtonProps {
  productId: string;
}

type ScoreField = 'taste_score' | 'portion_score' | 'price_score';

export function ProductScoreButton({ productId }: ProductScoreButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [scores, setScores] = useState<Record<ScoreField, string>>({
    taste_score: '',
    portion_score: '',
    price_score: '',
  });

  const updateScore = (field: ScoreField, value: string) => {
    setScores((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/products/${productId}/scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scores),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Unable to save scores.');
      }

      setScores({ taste_score: '', portion_score: '', price_score: '' });
      setIsOpen(false);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save scores.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <Button type="button" onClick={() => setIsOpen((current) => !current)} className="w-full gap-2">
        <Star className="h-5 w-5" />
        Add Price, Taste, and Portion Scores
      </Button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <ScoreInput
              label="Taste score"
              value={scores.taste_score}
              onChange={(value) => updateScore('taste_score', value)}
            />
            <ScoreInput
              label="Portion score"
              value={scores.portion_score}
              onChange={(value) => updateScore('portion_score', value)}
            />
            <ScoreInput
              label="Price score"
              value={scores.price_score}
              onChange={(value) => updateScore('price_score', value)}
            />
          </div>

          {error && <p className="text-sm text-primary-700">{error}</p>}

          <div className="flex gap-2">
            <Button type="submit" disabled={isSaving} className="gap-2">
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Scores
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

function ScoreInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <input
        type="number"
        min="1"
        max="5"
        step="0.1"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        required
      />
    </label>
  );
}
