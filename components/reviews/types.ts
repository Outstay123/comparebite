export interface ValueFeedbackOption {
  id: string;
  label: string;
  description: string;
  score: number;
}

export const VALUE_FEEDBACK_OPTIONS: ValueFeedbackOption[] = [
  {
    id: 'excellent',
    label: 'Excellent Value',
    description: 'Great portion and worth every ringgit',
    score: 10,
  },
  {
    id: 'worth_it',
    label: 'Worth It',
    description: 'Good overall value for the price',
    score: 7,
  },
  {
    id: 'slightly_expensive',
    label: 'Slightly Expensive',
    description: 'Okay, but slightly overpriced',
    score: 5,
  },
  {
    id: 'overpriced',
    label: 'Overpriced',
    description: 'Not worth the current price',
    score: 3,
  },
];
