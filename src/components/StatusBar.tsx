"use client";

interface StatusBarProps {
  webgpuSupported: boolean | null;
  loadedModel: string | null;
  loadedDevice: string | null;
  tps: number;
  numTokens: number;
  isGenerating: boolean;
}

export function StatusBar({
  webgpuSupported,
  loadedModel,
  loadedDevice,
  tps,
  numTokens,
  isGenerating,
}: StatusBarProps) {
  return (
    <div className="flex items-center gap-4 border-b border-white/10 bg-[#111] px-4 py-2 text-sm">
      <div className="flex items-center gap-2">
        {webgpuSupported === null ? (
          <span className="text-zinc-500">Checking GPU...</span>
        ) : webgpuSupported ? (
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-emerald-400">WebGPU</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
            <span className="text-amber-400">WASM only</span>
          </span>
        )}
      </div>

      {loadedDevice && (
        <span className="text-zinc-500">
          via {loadedDevice.toUpperCase()}
        </span>
      )}

      <div className="h-4 w-px bg-white/10" />

      <span className="text-zinc-400 truncate max-w-[300px]">
        {loadedModel ? (
          <>
            Model: <span className="text-zinc-200">{loadedModel.split("/").pop()}</span>
          </>
        ) : (
          "No model loaded"
        )}
      </span>

      <div className="ml-auto flex items-center gap-3">
        {(isGenerating || numTokens > 0) && (
          <>
            <span className="text-zinc-400">
              {numTokens} tokens
            </span>
            <span className="font-mono text-blue-400">
              {tps > 0 ? `${tps.toFixed(1)} t/s` : "..."}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
