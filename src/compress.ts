import workerSource from "virtual:compress-worker-source";

export interface Compressor {
  supports(mime: string, ext: string): boolean;
  compress(input: ArrayBuffer, mime: string, ext: string): Promise<ArrayBuffer>;
  prewarm?(): void;
}

interface CompressionWorkerDoneMessage {
  type: "done";
  id: number;
  output: ArrayBuffer;
}

interface CompressionWorkerErrorMessage {
  type: "error";
  id: number;
  message: string;
}

type CompressionWorkerMessage = CompressionWorkerDoneMessage | CompressionWorkerErrorMessage;

type CompressionWorkerRequest = {
  resolve: (value: ArrayBuffer) => void;
  reject: (reason?: unknown) => void;
};

class WorkerBackedPngCompressor implements Compressor {
  private workerState: CompressionWorkerState | null = null;

  supports(mime: string, ext: string): boolean {
    return mime.toLowerCase() === "image/png" || ext.toLowerCase() === "png";
  }

  async compress(input: ArrayBuffer, mime: string, ext: string): Promise<ArrayBuffer> {
    if (!this.supports(mime, ext)) {
      return input;
    }

    try {
      const state = this.getWorkerState();
      if (!state) {
        return input;
      }

      return await state.compress(input.slice(0));
    } catch {
      return input;
    }
  }

  prewarm(): void {
    this.getWorkerState()?.prewarm();
  }

  private getWorkerState(): CompressionWorkerState | null {
    if (this.workerState) {
      return this.workerState;
    }

    if (typeof Worker === "undefined") {
      return null;
    }

    try {
      this.workerState = new CompressionWorkerState(workerSource);
      return this.workerState;
    } catch {
      return null;
    }
  }
}

class CompressionWorkerState {
  private readonly worker: Worker;
  private nextId = 1;
  private readonly pending = new Map<number, CompressionWorkerRequest>();

  constructor(source: string) {
    const blob = new Blob([source], { type: "text/javascript" });
    const workerUrl = URL.createObjectURL(blob);

    this.worker = new Worker(workerUrl);

    this.worker.addEventListener("message", (event: MessageEvent<CompressionWorkerMessage>) => {
      this.handleMessage(event.data);
    });

    this.worker.addEventListener("error", (event) => {
      const error = event.error instanceof Error ? event.error : new Error(event.message || "Compression worker failed.");
      this.rejectAll(error);
    });
  }

  prewarm(): void {
    this.worker.postMessage({ type: "warmup" });
  }

  compress(input: ArrayBuffer): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const id = this.nextId++;
      this.pending.set(id, { resolve, reject });
      this.worker.postMessage(
        {
          type: "compress",
          id,
          input,
        },
        [input],
      );
    });
  }

  private handleMessage(message: CompressionWorkerMessage): void {
    const request = this.pending.get(message.id);
    if (!request) {
      return;
    }

    this.pending.delete(message.id);

    if (message.type === "done") {
      request.resolve(message.output);
      return;
    }

    request.reject(new Error(message.message));
  }

  private rejectAll(error: Error): void {
    for (const request of this.pending.values()) {
      request.reject(error);
    }

    this.pending.clear();
  }
}

let defaultCompressor: Compressor | null = null;

export function createDefaultCompressor(): Compressor {
  if (!defaultCompressor) {
    defaultCompressor = new WorkerBackedPngCompressor();
  }

  return defaultCompressor;
}

export function prewarmDefaultCompressor(): void {
  createDefaultCompressor().prewarm?.();
}
