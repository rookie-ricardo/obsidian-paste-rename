import { App, normalizePath, Vault } from "obsidian";
import { Compressor } from "./compress";
import { buildFileName, joinVaultPath, resolveFileExtension } from "./path";
import { PasteRenameSettings } from "./settings";
import { createTemplateContext, hasUniqueToken, renderTemplate, TemplateContext } from "./template";
import { buildReferenceLink } from "./writeback";

export interface SaveResult {
  vaultPath: string;
  linkText: string;
}

interface ResolveUniquePathInput {
  settings: Pick<PasteRenameSettings, "assetPattern">;
  noteBaseName: string;
  extension: string;
  exists: (vaultPath: string) => Promise<boolean>;
  now?: () => Date;
  maxAttempts?: number;
  contextFactory?: (noteBaseName: string, date: Date) => TemplateContext;
}

export class AssetStorage {
  constructor(
    private readonly app: App,
    private readonly settingsProvider: () => PasteRenameSettings,
    private readonly compressor: Compressor,
  ) {}

  async saveFile(file: File, noteBaseName: string): Promise<SaveResult> {
    const settings = this.settingsProvider();
    const extension = resolveFileExtension(file);
    const rawBuffer = await file.arrayBuffer();
    const content = await this.maybeCompress(rawBuffer, file.type, extension, settings);

    const vaultPath = await resolveUniqueVaultPath({
      settings,
      noteBaseName,
      extension,
      exists: (path) => this.app.vault.adapter.exists(path),
    });

    await ensureFolderExists(this.app.vault, getParentFolderPath(vaultPath));
    await this.app.vault.createBinary(vaultPath, content);
    const isImage = isImageFile(file.type, extension);

    return {
      vaultPath,
      linkText: buildReferenceLink(this.app, vaultPath, isImage),
    };
  }

  private async maybeCompress(
    input: ArrayBuffer,
    mime: string,
    extension: string,
    settings: PasteRenameSettings,
  ): Promise<ArrayBuffer> {
    if (!settings.compressionEnabled) {
      return input;
    }

    if (settings.compressionMode !== "lossless-only") {
      return input;
    }

    if (!this.compressor.supports(mime, extension)) {
      return input;
    }

    return this.compressor.compress(input, mime, extension);
  }
}

export async function resolveUniqueVaultPath(input: ResolveUniquePathInput): Promise<string> {
  const hasExplicitUniqueToken = hasUniqueToken(input.settings.assetPattern);
  const maxAttempts = input.maxAttempts ?? 20;
  const now = input.now ?? (() => new Date());
  const contextFactory = input.contextFactory ?? createTemplateContext;
  const fixedDate = now();

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const context = contextFactory(input.noteBaseName, fixedDate);
    const renderedPattern = renderTemplate(input.settings.assetPattern, context);
    const { directory, baseName } = splitRenderedPattern(renderedPattern);

    const deDupedName =
      attempt > 0 && !hasExplicitUniqueToken ? `${baseName}-${context.randomHex(8)}` : baseName;

    const filename = buildFileName(deDupedName, input.extension);
    const candidatePath = normalizePath(directory ? joinVaultPath(directory, filename) : filename);

    if (!(await input.exists(candidatePath))) {
      return candidatePath;
    }
  }

  throw new Error(`Could not generate a unique filename in ${maxAttempts} attempts.`);
}

async function ensureFolderExists(vault: Vault, folderPath: string): Promise<void> {
  const normalized = normalizePath(folderPath).replace(/^\/+/, "");
  if (!normalized) {
    return;
  }

  const parts = normalized.split("/").filter(Boolean);
  let currentPath = "";

  for (const part of parts) {
    currentPath = currentPath ? `${currentPath}/${part}` : part;
    if (!(await vault.adapter.exists(currentPath))) {
      try {
        await vault.createFolder(currentPath);
      } catch (_error) {
        if (!(await vault.adapter.exists(currentPath))) {
          throw _error;
        }
      }
    }
  }
}

function getParentFolderPath(path: string): string {
  const idx = path.lastIndexOf("/");
  if (idx < 0) {
    return "";
  }

  return path.slice(0, idx);
}

function splitRenderedPattern(pattern: string): { directory: string; baseName: string } {
  const normalized = normalizePath(pattern.replace(/^\/+/, "").replace(/\/+$/, ""));
  if (!normalized) {
    throw new Error("Asset pattern produced an empty path.");
  }

  const index = normalized.lastIndexOf("/");
  if (index < 0) {
    return { directory: "", baseName: normalized };
  }

  const directory = normalized.slice(0, index);
  const baseName = normalized.slice(index + 1);
  if (!baseName.trim()) {
    throw new Error("Asset pattern must include a file-name segment.");
  }

  return { directory, baseName };
}

function isImageFile(mime: string, extension: string): boolean {
  if (mime.toLowerCase().startsWith("image/")) {
    return true;
  }

  return ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "tiff", "avif", "heic", "heif"].includes(
    extension.toLowerCase(),
  );
}
