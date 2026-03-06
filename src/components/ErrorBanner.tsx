"use client";

interface ErrorBannerProps {
  error: string;
  onDismiss: () => void;
}

export function ErrorBanner({ error, onDismiss }: ErrorBannerProps) {
  return (
    <div className="flex items-start gap-3 border-b border-red-500/20 bg-red-500/10 px-4 py-3">
      <span className="mt-0.5 text-red-400">&#x26A0;</span>
      <p className="flex-1 text-sm text-red-300">{error}</p>
      <button
        onClick={onDismiss}
        className="text-red-400 hover:text-red-300 transition-colors"
      >
        &#x2715;
      </button>
    </div>
  );
}
