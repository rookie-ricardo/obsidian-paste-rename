import { App, MarkdownView, Notice, Plugin } from "obsidian";
import { getNoteBaseName } from "./path";
import { PasteRenameSettings } from "./settings";
import { AssetStorage, SaveResult } from "./storage";
import { writeLinksAtCursor } from "./writeback";

interface SaveFailure {
  fileName: string;
  reason: string;
}

export class PasteDropController {
  constructor(
    private readonly app: App,
    private readonly settingsProvider: () => PasteRenameSettings,
    private readonly storage: AssetStorage,
  ) {}

  register(plugin: Plugin): void {
    const captureOptions: AddEventListenerOptions = { capture: true };

    plugin.registerDomEvent(
      document,
      "paste",
      (evt) => {
        void this.onPaste(evt);
      },
      captureOptions,
    );

    plugin.registerDomEvent(
      document,
      "drop",
      (evt) => {
        void this.onDrop(evt);
      },
      captureOptions,
    );
  }

  private async onPaste(event: ClipboardEvent): Promise<void> {
    const files = extractFilesFromClipboard(event);
    if (files.length === 0) {
      return;
    }

    await this.processFiles(event, files);
  }

  private async onDrop(event: DragEvent): Promise<void> {
    const files = extractFilesFromDrop(event);
    if (files.length === 0) {
      return;
    }

    await this.processFiles(event, files);
  }

  private async processFiles(event: ClipboardEvent | DragEvent, files: File[]): Promise<void> {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!shouldIntercept(this.settingsProvider(), view)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const noteBaseName = getNoteBaseName(view.file?.name);
    const successes: SaveResult[] = [];
    const failures: SaveFailure[] = [];

    for (const file of files) {
      try {
        const saved = await this.storage.saveFile(file, noteBaseName);
        successes.push(saved);
      } catch (error) {
        failures.push({
          fileName: file.name || "unnamed",
          reason: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    if (successes.length > 0) {
      writeLinksAtCursor(
        view.editor,
        successes.map((result) => result.linkText),
      );
    }

    if (failures.length > 0) {
      this.showFailureNotice(successes.length, failures);
    }
  }

  private showFailureNotice(successCount: number, failures: SaveFailure[]): void {
    if (successCount === 0) {
      const message = formatFailureReasons(failures);
      new Notice(`Paste Rename: failed to save all files. ${message}`);
      return;
    }

    new Notice(`Paste Rename: saved ${successCount} file(s), failed ${failures.length}. ${formatFailureReasons(failures)}`);
  }
}

function shouldIntercept(settings: PasteRenameSettings, view: MarkdownView | null): view is MarkdownView {
  return settings.interceptScope === "markdown-only" && !!view?.editor;
}

function extractFilesFromClipboard(event: ClipboardEvent): File[] {
  const files = Array.from(event.clipboardData?.files ?? []);
  if (files.length > 0) {
    return files;
  }

  const fromItems: File[] = [];
  const items = Array.from(event.clipboardData?.items ?? []);
  for (const item of items) {
    if (item.kind !== "file") {
      continue;
    }

    const file = item.getAsFile();
    if (file) {
      fromItems.push(file);
    }
  }

  return fromItems;
}

function extractFilesFromDrop(event: DragEvent): File[] {
  return Array.from(event.dataTransfer?.files ?? []);
}

function formatFailureReasons(failures: SaveFailure[]): string {
  return failures
    .slice(0, 3)
    .map((failure) => `${failure.fileName}: ${failure.reason}`)
    .join(" | ");
}
