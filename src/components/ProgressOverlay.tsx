"use client";

import { ProgressInfo } from "@/types";

interface ProgressOverlayProps {
  progress: Map<string, ProgressInfo>;
  message: string;
}

export function ProgressOverlay({ progress, message }: ProgressOverlayProps) {
  const entries = Array.from(progress.values());
  const totalLoaded = entries.reduce((s, p) => s + p.loaded, 0);
  const totalSize = entries.reduce((s, p) => s + p.total, 0);
  const overallPercent = totalSize > 0 ? (totalLoaded / totalSize) * 100 : 0;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md space-y-4 rounded-xl border border-white/10 bg-[#141414] p-6">
        <div className="text-center">
          <div className="mb-1 text-lg font-medium text-zinc-200">
            Loading Model
          </div>
          <div className="text-sm text-zinc-500">{message}</div>
        </div>

        {entries.length > 0 && (
          <>
            <div>
              <div className="mb-1 flex justify-between text-xs text-zinc-500">
                <span>Overall</span>
                <span>{overallPercent.toFixed(0)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-200"
                  style={{ width: `${overallPercent}%` }}
                />
              </div>
            </div>

            <div className="max-h-40 space-y-2 overflow-y-auto">
              {entries.map((p) => (
                <div key={p.file} className="text-xs">
                  <div className="mb-0.5 flex justify-between text-zinc-500">
                    <span className="truncate max-w-[250px]">{p.file}</span>
                    <span>{p.progress.toFixed(0)}%</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-blue-500/60 transition-all duration-200"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center text-xs text-zinc-600">
              {formatBytes(totalLoaded)} / {formatBytes(totalSize)}
            </div>
          </>
        )}

        {entries.length === 0 && (
          <div className="flex justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        )}
      </div>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
