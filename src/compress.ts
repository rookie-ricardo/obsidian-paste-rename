export interface Compressor {
  supports(mime: string, ext: string): boolean;
  compress(input: ArrayBuffer, mime: string, ext: string): Promise<ArrayBuffer>;
}

export class LosslessPngCompressor implements Compressor {
  supports(mime: string, ext: string): boolean {
    return mime.toLowerCase() === "image/png" || ext.toLowerCase() === "png";
  }

  async compress(input: ArrayBuffer, mime: string, ext: string): Promise<ArrayBuffer> {
    if (!this.supports(mime, ext)) {
      return input;
    }

    try {
      const module = await import("@jsquash/oxipng");
      const optimized = await module.optimise(input);
      return optimized.byteLength < input.byteLength ? optimized : input;
    } catch (_error) {
      return input;
    }
  }
}

export function createDefaultCompressor(): Compressor {
  return new LosslessPngCompressor();
}
