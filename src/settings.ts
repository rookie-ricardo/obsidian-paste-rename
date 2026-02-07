import { App, PluginSettingTab, Setting, TextComponent } from "obsidian";
import type PasteRenamePlugin from "../main";
import { renderTemplate, validateTemplate } from "./template";

export interface PasteRenameSettings {
  assetPattern: string;
  interceptScope: "markdown-only";
  fileScope: "all-files";
  dedupeMode: "regen-unique";
  writebackSyntax: "follow-app-setting";
  compressionEnabled: boolean;
  compressionMode: "lossless-only";
}

export const DEFAULT_SETTINGS: PasteRenameSettings = {
  assetPattern: "09-Assets/{{YYYY}}-{{MM}}/{{YYYY}}{{MM}}{{DD}}-{{FILENAME}}-{{HASH:16}}",
  interceptScope: "markdown-only",
  fileScope: "all-files",
  dedupeMode: "regen-unique",
  writebackSyntax: "follow-app-setting",
  compressionEnabled: false,
  compressionMode: "lossless-only",
};

const LEGACY_DEFAULT_PATH_TEMPLATE = "09-Assets/{{YYYY}}-{{MM}}/";
const LEGACY_DEFAULT_NAME_TEMPLATE = "{{YYYY}}{{MM}}{{DD}}-{{FILENAME}}-{{HASH:16}}";

interface LegacySettings {
  pathTemplate?: string;
  nameTemplate?: string;
  pathPrefix?: string;
}

export function coerceSettings(partial: Partial<PasteRenameSettings> & LegacySettings): PasteRenameSettings {
  const migratedPattern = migrateLegacyPattern(partial);

  return {
    ...DEFAULT_SETTINGS,
    assetPattern: migratedPattern ?? DEFAULT_SETTINGS.assetPattern,
    ...partial,
    interceptScope: "markdown-only",
    fileScope: "all-files",
    dedupeMode: "regen-unique",
    writebackSyntax: "follow-app-setting",
    compressionMode: "lossless-only",
  };
}

export function validateSettings(settings: PasteRenameSettings): void {
  validateTemplate(settings.assetPattern, "Asset pattern");
  validateAssetPatternShape(settings.assetPattern);
}

export class PasteRenameSettingTab extends PluginSettingTab {
  constructor(app: App, private readonly plugin: PasteRenamePlugin) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    this.addPatternSetting(containerEl);
    this.addCompressionSetting(containerEl);
  }

  private addPatternSetting(containerEl: HTMLElement): void {
    const guide = containerEl.createDiv({ cls: "paste-rename-setting-guide" });
    const guideHeading = new Setting(guide).setName("Asset pattern").setHeading();
    guideHeading.settingEl.addClass("paste-rename-guide-heading");
    guide.createEl("p", { text: "Single pattern for folder + filename generation. Extension is appended automatically." });
    guide.createEl("p", { text: "Available variables:" });
    const list = guide.createEl("ul");
    list.createEl("li", { text: "{{YYYY}} {{YY}} {{MM}} {{DD}} {{HH}} {{mm}} {{ss}}: current local time." });
    list.createEl("li", { text: "{{FILENAME}}: active note name without .md, sanitized." });
    list.createEl("li", { text: "{{UUID}}: random v4 UUID." });
    list.createEl("li", { text: "{{HASH:n}}: random lowercase hex, n is 1..64." });
    guide.createEl("p", {
      cls: "paste-rename-setting-example",
      text: "Example: 09-Assets/{{YYYY}}-{{MM}}/{{YYYY}}{{MM}}{{DD}}-{{FILENAME}}-{{HASH:16}}",
    });
    const pastedPreview = guide.createDiv({ cls: "paste-rename-setting-preview" });
    pastedPreview.createEl("p", { cls: "paste-rename-setting-preview-title", text: "Image paste preview" });
    const previewPathEl = pastedPreview.createEl("p", { cls: "paste-rename-setting-preview-code" });
    const previewLinkEl = pastedPreview.createEl("p", { cls: "paste-rename-setting-preview-code" });
    const updatePreview = (pattern: string) => {
      try {
        validateTemplate(pattern, "Asset pattern");
        validateAssetPatternShape(pattern);
        const samplePath = buildImagePastePreviewPath(pattern);
        const sampleLink = shouldUseWikilinks(this.app) ? `![[${samplePath}]]` : `![](<${samplePath}>)`;
        previewPathEl.setText(`Saved as: ${samplePath}`);
        previewLinkEl.setText(`Inserted link: ${sampleLink}`);
      } catch {
        previewPathEl.setText("Saved as: (invalid pattern)");
        previewLinkEl.setText("Inserted link: (invalid pattern)");
      }
    };
    updatePreview(this.plugin.settings.assetPattern);

    const errorEl = containerEl.createDiv({ cls: "paste-rename-setting-error" });
    const setting = new Setting(containerEl)
      .setName("Pattern")
      .setDesc("One template contains both path and filename.");
    setting.settingEl.addClass("paste-rename-pattern-setting");

    setting.addText((text) => {
      text.setValue(this.plugin.settings.assetPattern);
      text.inputEl.setAttribute("placeholder", DEFAULT_SETTINGS.assetPattern);
      text.onChange(async (value) => {
        updatePreview(value);
        await this.persistValidatedText(
          text,
          errorEl,
          value,
          (next) => {
            validateTemplate(next, "Asset pattern");
            validateAssetPatternShape(next);
          },
          { assetPattern: value },
        );
      });
    });
  }

  private addCompressionSetting(containerEl: HTMLElement): void {
    new Setting(containerEl)
      .setName("Enable lossless PNG compression")
      .setDesc("Default off. When enabled, PNG files are optimized with oxipng wasm if output is smaller.")
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.compressionEnabled);
        toggle.onChange(async (value) => {
          await this.plugin.updateSettings({ compressionEnabled: value });
        });
      });
  }

  private async persistValidatedText(
    text: TextComponent,
    errorEl: HTMLElement,
    nextValue: string,
    validator: (value: string) => void,
    patch: Partial<PasteRenameSettings>,
  ): Promise<void> {
    try {
      validator(nextValue);
      clearError(errorEl, text);
      await this.plugin.updateSettings(patch);
    } catch (error) {
      showError(errorEl, text, error instanceof Error ? error.message : "Invalid value");
    }
  }
}

function validateAssetPatternShape(pattern: string): void {
  const normalized = pattern.trim().replace(/\\/g, "/").replace(/^\/+/, "");
  if (!normalized) {
    throw new Error("Asset pattern must not be empty.");
  }

  const segments = normalized.split("/").filter(Boolean);
  if (segments.some((segment) => segment === "..")) {
    throw new Error("Asset pattern must not contain '..' segments.");
  }

  const lastSegment = normalized.split("/").pop() ?? "";
  if (!lastSegment.trim()) {
    throw new Error("Asset pattern must include a file-name segment.");
  }
}

function migrateLegacyPattern(partial: Partial<PasteRenameSettings> & LegacySettings): string | undefined {
  if (partial.assetPattern) {
    return partial.assetPattern;
  }

  if (!partial.pathTemplate && !partial.nameTemplate && !partial.pathPrefix) {
    return undefined;
  }

  const prefix = (partial.pathPrefix ?? "").trim().replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  const path = (partial.pathTemplate ?? LEGACY_DEFAULT_PATH_TEMPLATE).trim().replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  const name = (partial.nameTemplate ?? LEGACY_DEFAULT_NAME_TEMPLATE).trim().replace(/^\/+|\/+$/g, "");
  const merged = [prefix, path, name].filter(Boolean).join("/");
  return merged || DEFAULT_SETTINGS.assetPattern;
}

function clearError(errorEl: HTMLElement, text: TextComponent): void {
  errorEl.empty();
  text.inputEl.removeClass("is-invalid");
}

function showError(errorEl: HTMLElement, text: TextComponent, message: string): void {
  errorEl.setText(message);
  text.inputEl.addClass("is-invalid");
}

function buildImagePastePreviewPath(pattern: string): string {
  const rendered = renderTemplate(pattern, {
    date: new Date("2026-02-07T15:32:10"),
    fileNameBase: "测试文件",
    uuid: "123e4567-e89b-12d3-a456-426614174000",
    randomHex: (length) => "c7c8d9e0f1a2b3c4".slice(0, length).padEnd(length, "0"),
  });

  return `${rendered}.png`;
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
