"use client";

import { useState, useEffect, useRef } from "react";
import { MODEL_PRESETS } from "@/lib/constants";
import { ChevronDown, Check, Circle } from "lucide-react";

interface ModelSelectorProps {
  selectedModel: string;
  loadedModel: string | null;
  isLoading: boolean;
  disabled: boolean;
  onSelect: (modelId: string) => void;
  onLoad: (modelId: string) => void;
}

export function ModelSelector({
  selectedModel,
  loadedModel,
  isLoading,
  disabled,
  onSelect,
  onLoad,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [customId, setCustomId] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayName = selectedModel
    ? selectedModel.split("/").pop()
    : "Select model";

  const isModelReady = loadedModel === selectedModel && !isLoading;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-[#ececec] hover:bg-[#2f2f2f] transition-colors"
      >
        {/* Status indicator */}
        <span
          className={`inline-block h-2 w-2 rounded-full ${
            isLoading
              ? "bg-amber-400 animate-pulse"
              : isModelReady
                ? "bg-[#10a37f]"
                : "bg-[#8e8e8e]"
          }`}
        />
        <span className="max-w-[200px] truncate">
          {isLoading ? "Loading..." : displayName}
        </span>
        <ChevronDown
          size={14}
          className={`text-[#8e8e8e] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-72 rounded-xl border border-white/[0.08] bg-[#2f2f2f] py-1 shadow-xl z-50">
          {MODEL_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                onSelect(preset.id);
                setOpen(false);
              }}
              disabled={isLoading || disabled}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[#ececec] hover:bg-[#424242] transition-colors disabled:opacity-40"
            >
              <span className="w-4 flex-shrink-0 flex justify-center">
                {loadedModel === preset.id ? (
                  <Check size={14} className="text-[#10a37f]" />
                ) : selectedModel === preset.id ? (
                  <Circle size={14} className="text-[#8e8e8e]" />
                ) : null}
              </span>
              {preset.label}
            </button>
          ))}

          <div className="mx-3 my-1 border-t border-white/[0.08]" />

          <div className="px-3 py-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={customId}
                onChange={(e) => setCustomId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && customId.trim()) {
                    onSelect(customId.trim());
                    setOpen(false);
                    setCustomId("");
                  }
                }}
                placeholder="Custom HF model ID..."
                className="flex-1 rounded-lg border border-white/[0.08] bg-[#212121] px-2.5 py-1.5 text-sm text-[#ececec] placeholder-[#8e8e8e] outline-none focus:border-white/[0.2]"
              />
              <button
                onClick={() => {
                  if (customId.trim()) {
                    onSelect(customId.trim());
                    setOpen(false);
                    setCustomId("");
                  }
                }}
                disabled={!customId.trim() || isLoading || disabled}
                className="rounded-lg bg-[#10a37f] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#0d8c6d] disabled:opacity-40 transition-colors"
              >
                Select
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
