import { sanitizeFileNamePart } from "./path";

const TOKEN_REGEX = /{{\s*([A-Za-z]+(?::\d+)?)\s*}}/g;
const ALLOWED_LITERAL_TOKENS = new Set(["YYYY", "YY", "MM", "DD", "HH", "mm", "ss", "FILENAME", "UUID"]);

export interface TemplateContext {
  date: Date;
  fileNameBase: string;
  uuid: string;
  randomHex: (length: number) => string;
}

export function hasUniqueToken(template: string): boolean {
  return /{{\s*(UUID|HASH:\d+)\s*}}/.test(template);
}

export function validateTemplate(template: string, label: string): void {
  if (!template.trim()) {
    throw new Error(`${label} must not be empty.`);
  }

  TOKEN_REGEX.lastIndex = 0;
  const hasWellFormedToken = TOKEN_REGEX.test(template);
  TOKEN_REGEX.lastIndex = 0;
  const malformedOpening = template.includes("{{") && !hasWellFormedToken;

  let match: RegExpExecArray | null;
  while ((match = TOKEN_REGEX.exec(template)) !== null) {
    validateToken(match[1], label);
  }

  TOKEN_REGEX.lastIndex = 0;
  const scrubbed = template.replace(TOKEN_REGEX, "");
  if (malformedOpening || scrubbed.includes("{{") || scrubbed.includes("}}")) {
    throw new Error(`${label} contains malformed template braces.`);
  }
}

export function renderTemplate(template: string, context: TemplateContext): string {
  validateTemplate(template, "Template");

  return template.replace(TOKEN_REGEX, (_full, rawToken: string) => {
    const token = rawToken.trim();
    const hashMatch = /^HASH:(\d+)$/.exec(token);
    if (hashMatch) {
      const length = Number(hashMatch[1]);
      validateHashLength(length);
      return context.randomHex(length);
    }

    switch (token) {
      case "YYYY":
        return `${context.date.getFullYear()}`;
      case "YY":
        return `${context.date.getFullYear()}`.slice(-2);
      case "MM":
        return pad2(context.date.getMonth() + 1);
      case "DD":
        return pad2(context.date.getDate());
      case "HH":
        return pad2(context.date.getHours());
      case "mm":
        return pad2(context.date.getMinutes());
      case "ss":
        return pad2(context.date.getSeconds());
      case "FILENAME":
        return context.fileNameBase;
      case "UUID":
        return context.uuid;
      default:
        throw new Error(`Unknown template token: ${token}`);
    }
  });
}

export function createTemplateContext(fileNameBase: string, date = new Date()): TemplateContext {
  return {
    date,
    fileNameBase: sanitizeFileNamePart(fileNameBase),
    uuid: generateUuidV4(),
    randomHex: generateRandomHex,
  };
}

function validateToken(token: string, label: string): void {
  const hashMatch = /^HASH:(\d+)$/.exec(token);
  if (hashMatch) {
    validateHashLength(Number(hashMatch[1]));
    return;
  }

  if (!ALLOWED_LITERAL_TOKENS.has(token)) {
    throw new Error(`${label} contains unsupported token: ${token}`);
  }
}

function validateHashLength(length: number): void {
  if (!Number.isInteger(length) || length < 1 || length > 64) {
    throw new Error("HASH length must be an integer between 1 and 64.");
  }
}

function generateUuidV4(): string {
  const cryptoObj = globalThis.crypto;
  if (cryptoObj?.randomUUID) {
    return cryptoObj.randomUUID();
  }

  const bytes = getRandomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytesToHex(bytes);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function generateRandomHex(length: number): string {
  validateHashLength(length);
  const bytes = getRandomBytes(Math.ceil(length / 2));
  return bytesToHex(bytes).slice(0, length);
}

function getRandomBytes(length: number): Uint8Array {
  const cryptoObj = globalThis.crypto;
  if (cryptoObj?.getRandomValues) {
    return cryptoObj.getRandomValues(new Uint8Array(length));
  }

  const fallback = new Uint8Array(length);
  for (let i = 0; i < fallback.length; i += 1) {
    fallback[i] = Math.floor(Math.random() * 256);
  }
  return fallback;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function pad2(value: number): string {
  return value.toString().padStart(2, "0");
}
