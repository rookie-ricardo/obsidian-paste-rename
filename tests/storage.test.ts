import { describe, expect, it, vi } from "vitest";
import type { Compressor } from "../src/compress";
import { AssetStorage } from "../src/storage";
import type { PasteRenameSettings } from "../src/settings";

const BASE_SETTINGS: PasteRenameSettings = {
  assetPattern: "uploads/fixed-name",
  interceptScope: "markdown-only",
  fileScope: "all-files",
  dedupeMode: "regen-unique",
  writebackSyntax: "follow-app-setting",
  compressionEnabled: true,
  compressionNoticeEnabled: false,
  compressionMode: "lossless-only",
};

describe("AssetStorage background compression", () => {
  it("saves the original buffer first and replaces it later with a smaller compressed buffer", async () => {
    const createdWrites: number[] = [];
    const modifiedWrites: number[] = [];
    const fileMap = new Map<string, { path: string }>();
    const folders = new Set<string>();

    const app = {
      vault: {
        getConfig: (key: string) => (key === "useMarkdownLinks" ? false : undefined),
        adapter: {
          exists: async (path: string) => folders.has(path) || fileMap.has(path),
        },
        createFolder: async (path: string) => {
          folders.add(path);
        },
        createBinary: async (path: string, data: ArrayBuffer) => {
          createdWrites.push(data.byteLength);
          const file = { path };
          fileMap.set(path, file);
          return file;
        },
        getFileByPath: (path: string) => fileMap.get(path) ?? null,
        modifyBinary: async (_file: { path: string }, data: ArrayBuffer) => {
          modifiedWrites.push(data.byteLength);
        },
      },
    };

    const compressor: Compressor = {
      supports: () => true,
      compress: vi.fn(async () => new Uint8Array([1, 2]).buffer),
    };

    const storage = new AssetStorage(app as never, () => BASE_SETTINGS, compressor);
    const file = new File([new Uint8Array([1, 2, 3, 4])], "image.png", { type: "image/png" });

    const result = await storage.saveFile(file, "Test Note");

    expect(result.vaultPath).toBe("uploads/fixed-name.png");
    expect(result.linkText).toBe("![[uploads/fixed-name.png]]");
    expect(createdWrites).toEqual([4]);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(modifiedWrites).toEqual([2]);
  });

  it("keeps the original file when compression does not reduce size", async () => {
    const modifiedWrites: number[] = [];
    const fileMap = new Map<string, { path: string }>();
    const folders = new Set<string>();

    const app = {
      vault: {
        getConfig: (key: string) => (key === "useMarkdownLinks" ? false : undefined),
        adapter: {
          exists: async (path: string) => folders.has(path) || fileMap.has(path),
        },
        createFolder: async (path: string) => {
          folders.add(path);
        },
        createBinary: async (path: string, _data: ArrayBuffer) => {
          const file = { path };
          fileMap.set(path, file);
          return file;
        },
        getFileByPath: (path: string) => fileMap.get(path) ?? null,
        modifyBinary: async (_file: { path: string }, data: ArrayBuffer) => {
          modifiedWrites.push(data.byteLength);
        },
      },
    };

    const compressor: Compressor = {
      supports: () => true,
      compress: vi.fn(async () => new Uint8Array([1, 2, 3, 4]).buffer),
    };

    const storage = new AssetStorage(app as never, () => BASE_SETTINGS, compressor);
    const file = new File([new Uint8Array([1, 2, 3, 4])], "image.png", { type: "image/png" });

    await storage.saveFile(file, "Test Note");
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(modifiedWrites).toEqual([]);
  });
});
