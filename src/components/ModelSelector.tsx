"use client";

import { useState } from "react";
import { MODEL_PRESETS, DEFAULT_MODEL } from "@/lib/constants";

interface ModelSelectorProps {
  onLoad: (modelId: string) => void;
  loadedModel: string | null;
  isLoading: boolean;
  disabled: boolean;
}

export function ModelSelector({
  onLoad,
  loadedModel,
  isLoading,
  disabled,
}: ModelSelectorProps) {
  const [modelId, setModelId] = useState(DEFAULT_MODEL);

  const isLoaded = loadedModel === modelId;

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Model
      </h3>

      <select
        value={MODEL_PRESETS.find((p) => p.id === modelId) ? modelId : ""}
        onChange={(e) => {
          if (e.target.value) setModelId(e.target.value);
        }}
        className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-zinc-200 outline-none focus:border-blue-500/50"
      >
        <option value="" disabled>
          Presets...
        </option>
        {MODEL_PRESETS.map((preset) => (
          <option key={preset.id} value={preset.id}>
            {preset.label}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={modelId}
        onChange={(e) => setModelId(e.target.value)}
        placeholder="HuggingFace model ID..."
        className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-blue-500/50"
      />

      <button
        onClick={() => onLoad(modelId)}
        disabled={!modelId.trim() || isLoading || disabled}
        className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          isLoaded
            ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
            : "bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40"
        }`}
      >
        {isLoading ? "Loading..." : isLoaded ? "Loaded" : "Load Model"}
      </button>
    </div>
  );
}
