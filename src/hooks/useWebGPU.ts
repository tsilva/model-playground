"use client";

import { useState, useEffect } from "react";
import { AdapterInfo } from "@/types";

interface WebGPUState {
  supported: boolean | null;
  adapterInfo: AdapterInfo | null;
  checking: boolean;
}

export function useWebGPU(): WebGPUState {
  const [state, setState] = useState<WebGPUState>({
    supported: null,
    adapterInfo: null,
    checking: true,
  });

  useEffect(() => {
    async function check() {
      if (!navigator.gpu) {
        setState({ supported: false, adapterInfo: null, checking: false });
        return;
      }

      try {
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
          setState({ supported: false, adapterInfo: null, checking: false });
          return;
        }

        const info = adapter.info;
        setState({
          supported: true,
          adapterInfo: {
            vendor: info.vendor || "unknown",
            architecture: info.architecture || "unknown",
            description: info.description || "unknown",
          },
          checking: false,
        });
      } catch {
        setState({ supported: false, adapterInfo: null, checking: false });
      }
    }

    check();
  }, []);

  return state;
}
