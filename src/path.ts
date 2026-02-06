import { normalizePath } from "obsidian";

const ILLEGAL_FILE_CHARS = /[<>:"/\\|?*\u0000-\u001f]/g;

const MIME_EXTENSION_MAP: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/bmp": "bmp",
  "image/tiff": "tiff",
  "application/pdf": "pdf",
  "text/plain": "txt",
  "text/markdown": "md",
  "application/json": "json",
  "application/zip": "zip",
  "application/x-zip-compressed": "zip",
};

export function sanitizeFileNamePart(value: string): string {
  const cleaned = value
    .replace(ILLEGAL_FILE_CHARS, "-")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[. ]+$/g, "");

  return cleaned.length > 0 ? cleaned : "untitled";
}

export function getNoteBaseName(fileName: string | null | undefined): string {
  if (!fileName) {
    return "Untitled";
  }

  const normalized = fileName.replace(/\\/g, "/");
  const justName = normalized.split("/").pop() ?? normalized;
  const lastDot = justName.lastIndexOf(".");
  const baseName = lastDot > 0 ? justName.slice(0, lastDot) : justName;
  return sanitizeFileNamePart(baseName);
}

export function resolveFileExtension(file: Pick<File, "name" | "type">): string {
  const fromName = extensionFromName(file.name);
  if (fromName) {
    return fromName;
  }

  const fromMime = MIME_EXTENSION_MAP[file.type.toLowerCase()];
  if (fromMime) {
    return fromMime;
  }

  return "bin";
}

export function buildDirectoryPath(prefix: string, renderedTemplatePath: string): string {
  const path = joinVaultPath(prefix, renderedTemplatePath);
  const segments = path.split("/").map((segment) => sanitizePathSegment(segment)).filter(Boolean);
  return normalizeVaultPath(segments.join("/"));
}

export function buildFileName(baseName: string, extension: string): string {
  const safeBase = sanitizeFileNamePart(baseName);
  const safeExt = sanitizeExtension(extension);
  return `${safeBase}.${safeExt}`;
}

export function normalizeVaultPath(path: string): string {
  return normalizePath(path.replace(/^\/+/, "").replace(/\/+$/, ""));
}

export function joinVaultPath(...parts: string[]): string {
  const joined = parts
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.replace(/^\/+|\/+$/g, ""))
    .filter(Boolean)
    .join("/");

  return normalizePath(joined);
}

function sanitizePathSegment(value: string): string {
  const sanitized = sanitizeFileNamePart(value);
  return sanitized === "untitled" && !value.trim() ? "" : sanitized;
}

function extensionFromName(fileName: string): string | null {
  const name = fileName.trim();
  const lastDot = name.lastIndexOf(".");
  if (lastDot <= 0 || lastDot === name.length - 1) {
    return null;
  }

  const ext = name.slice(lastDot + 1).toLowerCase().replace(/[^a-z0-9]/g, "");
  return ext.length > 0 ? ext : null;
}

function sanitizeExtension(extension: string): string {
  const normalized = extension.replace(/^\.+/, "").toLowerCase().replace(/[^a-z0-9]/g, "");
  return normalized || "bin";
}
