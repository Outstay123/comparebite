'use client';

interface ReviewMeUpButtonProps {
  onClick: () => void;
}

export function ReviewMeUpButton({ onClick }: ReviewMeUpButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full mt-4 px-6 py-3.5 rounded-xl bg-primary-600 text-white font-bold text-base shadow-md hover:bg-primary-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    >
      Review Me Up
    </button>
  );
}
