import {
  env,
  AutoTokenizer,
  AutoModelForCausalLM,
  TextStreamer,
  PreTrainedTokenizer,
  PreTrainedModel,
  Tensor,
} from "@huggingface/transformers";
import { WorkerRequest, WorkerResponse, ChatMessage, GenerationParams } from "@/types";

env.allowLocalModels = false;

let tokenizer: PreTrainedTokenizer | null = null;
let model: PreTrainedModel | null = null;
let currentModelId: string | null = null;
let shouldInterrupt = false;

function post(msg: WorkerResponse) {
  self.postMessage(msg);
}

async function dispose() {
  if (model) {
    try {
      await (model as unknown as { dispose?: () => Promise<void> }).dispose?.();
    } catch {
      // ignore
    }
    model = null;
  }
  tokenizer = null;
  currentModelId = null;
}

async function loadModel(modelId: string, device: "webgpu" | "wasm") {
  if (currentModelId === modelId) {
    post({ status: "loaded", modelId, device });
    return;
  }

  await dispose();

  post({ status: "loading", message: "Loading tokenizer..." });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const progressCallback = (progress: any) => {
    if (progress.status === "progress") {
      post({
        status: "progress",
        progress: {
          file: progress.file,
          progress: progress.progress,
          loaded: progress.loaded,
          total: progress.total,
        },
      });
    }
  };

  try {
    tokenizer = await AutoTokenizer.from_pretrained(modelId, {
      progress_callback: progressCallback,
    });

    post({ status: "loading", message: "Loading model..." });

    const dtype = device === "webgpu" ? "fp16" : "q4";
    model = await AutoModelForCausalLM.from_pretrained(modelId, {
      device,
      dtype,
      progress_callback: progressCallback,
    } as Parameters<typeof AutoModelForCausalLM.from_pretrained>[1]);

    currentModelId = modelId;

    // Warm up with a dummy generation
    post({ status: "loading", message: "Warming up..." });
    try {
      const dummyInput = tokenizer("Hello", { return_tensor: true });
      await (model as { generate: (args: Record<string, unknown>) => Promise<unknown> }).generate({
        ...dummyInput,
        max_new_tokens: 1,
      });
    } catch {
      // Warm-up failure is non-critical
    }

    post({ status: "loaded", modelId, device });
  } catch (err) {
    await dispose();
    post({ status: "error", error: `Failed to load model: ${(err as Error).message}` });
  }
}

async function generate(messages: ChatMessage[], params: GenerationParams) {
  if (!tokenizer || !model) {
    post({ status: "error", error: "No model loaded" });
    return;
  }

  shouldInterrupt = false;
  post({ status: "generating" });

  try {
    const chatMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const inputText = tokenizer.apply_chat_template(chatMessages, {
      tokenize: false,
      add_generation_prompt: true,
    }) as string;

    const inputs = tokenizer(inputText, { return_tensor: true }) as { input_ids: Tensor; attention_mask: Tensor };

    let numTokens = 0;
    const startTime = performance.now();

    const streamer = new TextStreamer(tokenizer, {
      skip_prompt: true,
      skip_special_tokens: true,
      callback_function: (token: string) => {
        numTokens++;
        const elapsed = (performance.now() - startTime) / 1000;
        const tps = numTokens / elapsed;
        post({ status: "update", token, tps, numTokens });
      },
    });

    await (model as { generate: (args: Record<string, unknown>) => Promise<unknown> }).generate({
      ...inputs,
      ...params,
      streamer,
      stopping_criteria: [
        (_ids: unknown, _logits: unknown) => {
          return shouldInterrupt;
        },
      ],
    });

    const elapsed = (performance.now() - startTime) / 1000;
    const tps = numTokens / elapsed;
    post({ status: "complete", tps, numTokens });
  } catch (err) {
    if (shouldInterrupt) {
      post({ status: "complete", tps: 0, numTokens: 0 });
    } else {
      post({
        status: "error",
        error: `Generation failed: ${(err as Error).message}`,
      });
    }
  }
}

self.addEventListener("message", async (event: MessageEvent<WorkerRequest>) => {
  const data = event.data;

  switch (data.type) {
    case "load":
      await loadModel(data.modelId, data.device);
      break;
    case "generate":
      await generate(data.messages, data.params);
      break;
    case "interrupt":
      shouldInterrupt = true;
      break;
    case "reset":
      await dispose();
      post({ status: "unloaded" });
      break;
  }
});

post({ status: "ready" });
