"use client";

interface ContextIndicatorProps {
  fullness: number;
  isModelLoaded: boolean;
}

export function ContextIndicator({ fullness, isModelLoaded }: ContextIndicatorProps) {
  // Only show when model is loaded and we have context data
  if (!isModelLoaded || fullness === 0) return null;

  // Color based on fullness level
  let colorClass = "text-[#10a37f]"; // Green (< 50%)
  if (fullness >= 80) {
    colorClass = "text-[#dc3545]"; // Red (> 80%)
  } else if (fullness >= 50) {
    colorClass = "text-[#f0ad4e]"; // Yellow (50-80%)
  }

  return (
    <span className={`ml-2 text-xs font-mono ${colorClass}`}>
      {fullness}%
    </span>
  );
}
