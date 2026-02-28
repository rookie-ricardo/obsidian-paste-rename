import initOxipng, { optimise as optimisePng } from "@jsquash/oxipng/codec/pkg/squoosh_oxipng.js";
// @ts-expect-error esbuild's binary loader replaces this import with Uint8Array bytes at build time.
import oxipngWasm from "@jsquash/oxipng/codec/pkg/squoosh_oxipng_bg.wasm";

const MIN_COMPRESSIBLE_PNG_BYTES = 300 * 1024;
const OXIPNG_LEVEL = 3;
const OXIPNG_INTERLACE = false;
const OXIPNG_OPTIMISE_ALPHA = true;

type WarmupMessage = {
  type: "warmup";
};

type CompressMessage = {
  type: "compress";
  id: number;
  input: ArrayBuffer;
};

type WorkerMessage = WarmupMessage | CompressMessage;

type WorkerResponse =
  | {
      type: "done";
      id: number;
      output: ArrayBuffer;
    }
  | {
      type: "error";
      id: number;
      message: string;
    };

interface CompressionWorkerScope {
  addEventListener(type: "message", listener: (event: MessageEvent<WorkerMessage>) => void): void;
  postMessage(message: WorkerResponse, transfer?: Transferable[]): void;
}

let oxipngReady: Promise<void> | null = null;
const oxipngWasmBytes = oxipngWasm as Uint8Array;
const workerScope = globalThis as unknown as CompressionWorkerScope;

workerScope.addEventListener("message", (event: MessageEvent<WorkerMessage>) => {
  void handleMessage(event.data);
});

async function handleMessage(message: WorkerMessage): Promise<void> {
  if (message.type === "warmup") {
    await ensureOxipngReady();
    return;
  }

  try {
    const output = await compressBuffer(message.input);
    const response: WorkerResponse = {
      type: "done",
      id: message.id,
      output,
    };
    workerScope.postMessage(response, [output]);
  } catch (error) {
    const response: WorkerResponse = {
      type: "error",
      id: message.id,
      message: error instanceof Error ? error.message : "Unknown compression error",
    };
    workerScope.postMessage(response);
  }
}

async function compressBuffer(input: ArrayBuffer): Promise<ArrayBuffer> {
  if (input.byteLength < MIN_COMPRESSIBLE_PNG_BYTES) {
    return input;
  }

  await ensureOxipngReady();
  const optimized = optimisePng(new Uint8Array(input), OXIPNG_LEVEL, OXIPNG_INTERLACE, OXIPNG_OPTIMISE_ALPHA);
  const output = toArrayBuffer(optimized);
  return output.byteLength < input.byteLength ? output : input;
}

async function ensureOxipngReady(): Promise<void> {
  if (!oxipngReady) {
    oxipngReady = initOxipng(oxipngWasmBytes).then(() => undefined);
  }

  await oxipngReady;
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}
