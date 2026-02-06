import type { App, Editor } from "obsidian";
import { normalizePath } from "obsidian";

export function buildReferenceLink(app: App, vaultPath: string, isImage: boolean): string {
  const normalized = normalizePath(vaultPath);
  if (shouldUseWikilinks(app)) {
    return isImage ? `![[${normalized}]]` : `[[${normalized}]]`;
  }

  const target = `<${normalized}>`;
  if (isImage) {
    return `![](${target})`;
  }

  const name = normalized.split("/").pop() ?? normalized;
  return `[${name}](${target})`;
}

export function writeLinksAtCursor(editor: Editor, links: string[]): void {
  if (links.length === 0) {
    return;
  }

  editor.replaceSelection(links.join("\n"));
}

function shouldUseWikilinks(app: App): boolean {
  const vault = app.vault as unknown as {
    getConfig?: (key: string) => unknown;
  };

  const useMarkdownLinks = vault.getConfig?.("useMarkdownLinks");
  if (typeof useMarkdownLinks === "boolean") {
    return !useMarkdownLinks;
  }

  const useWikilinks = vault.getConfig?.("useWikilinks");
  if (typeof useWikilinks === "boolean") {
    return useWikilinks;
  }

  return true;
}
