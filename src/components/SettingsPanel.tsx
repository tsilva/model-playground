"use client";

import { useState } from "react";
import { GenerationParams } from "@/types";
import { DEFAULT_PARAMS, PARAM_RANGES } from "@/lib/constants";

interface SettingsPanelProps {
  params: GenerationParams;
  onChange: (params: GenerationParams) => void;
  device: "webgpu" | "wasm";
  onDeviceChange: (device: "webgpu" | "wasm") => void;
  webgpuAvailable: boolean;
}

export function SettingsPanel({
  params,
  onChange,
  device,
  onDeviceChange,
  webgpuAvailable,
}: SettingsPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  const update = (key: keyof GenerationParams, value: number | boolean) => {
    onChange({ ...params, [key]: value });
  };

  return (
    <div className="space-y-3">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-400 transition-colors"
      >
        <span>Settings</span>
        <span>{collapsed ? "+" : "-"}</span>
      </button>

      {!collapsed && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-zinc-500">Device</label>
            <div className="flex gap-2">
              <button
                onClick={() => onDeviceChange("webgpu")}
                disabled={!webgpuAvailable}
                className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  device === "webgpu"
                    ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-[#1a1a1a] text-zinc-400 border border-white/10 hover:border-white/20"
                } disabled:opacity-30`}
              >
                WebGPU
              </button>
              <button
                onClick={() => onDeviceChange("wasm")}
                className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  device === "wasm"
                    ? "bg-amber-600/20 text-amber-400 border border-amber-500/30"
                    : "bg-[#1a1a1a] text-zinc-400 border border-white/10 hover:border-white/20"
                }`}
              >
                WASM
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-zinc-500">Sampling</label>
              <button
                onClick={() => update("do_sample", !params.do_sample)}
                className={`relative h-5 w-9 rounded-full transition-colors ${
                  params.do_sample ? "bg-blue-600" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                    params.do_sample ? "left-[18px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          <Slider
            label="Max tokens"
            value={params.max_new_tokens}
            {...PARAM_RANGES.max_new_tokens}
            onChange={(v) => update("max_new_tokens", v)}
          />

          {params.do_sample && (
            <>
              <Slider
                label="Temperature"
                value={params.temperature}
                {...PARAM_RANGES.temperature}
                onChange={(v) => update("temperature", v)}
              />
              <Slider
                label="Top P"
                value={params.top_p}
                {...PARAM_RANGES.top_p}
                onChange={(v) => update("top_p", v)}
              />
              <Slider
                label="Top K"
                value={params.top_k}
                {...PARAM_RANGES.top_k}
                onChange={(v) => update("top_k", v)}
              />
              <Slider
                label="Repetition penalty"
                value={params.repetition_penalty}
                {...PARAM_RANGES.repetition_penalty}
                onChange={(v) => update("repetition_penalty", v)}
              />
            </>
          )}

          <button
            onClick={() => onChange(DEFAULT_PARAMS)}
            className="w-full rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-400 hover:border-white/20 transition-colors"
          >
            Reset defaults
          </button>
        </div>
      )}
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-zinc-500">{label}</span>
        <span className="font-mono text-zinc-400">
          {Number.isInteger(step) ? value : value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-blue-500"
      />
    </div>
  );
}
