"use client";

interface ModelSelectorProps {
  isLoading: boolean;
  loadedModel: string | null;
  loadedPrecision: string | null;
}

export function ModelSelector({ isLoading, loadedModel, loadedPrecision }: ModelSelectorProps) {
  const isModelReady = loadedModel !== null && !isLoading;

  const displayModel = isLoading
    ? "Loading..."
    : (loadedModel?.replace(/^onnx-community\//, "") || "Qwen3.5 0.8B");

  return (
    <div className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-[#ececec]">
      <span
        className={`inline-block h-2 w-2 rounded-full ${
          isLoading
            ? "bg-amber-400 animate-pulse"
            : isModelReady
              ? "bg-[#10a37f]"
              : "bg-[#8e8e8e]"
        }`}
      />
      <span className="max-w-[140px] sm:max-w-[200px] truncate">
        {displayModel}
      </span>
      {loadedPrecision && !isLoading && (
        <span className="text-xs text-[#8e8e8e] ml-1">
          · {loadedPrecision}
        </span>
      )}
    </div>
  );
}
