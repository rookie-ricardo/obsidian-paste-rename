import { Notice, Plugin } from "obsidian";
import { createDefaultCompressor } from "./src/compress";
import { PasteDropController } from "./src/events";
import { PasteRenameSettings, DEFAULT_SETTINGS, PasteRenameSettingTab, coerceSettings, validateSettings } from "./src/settings";
import { AssetStorage } from "./src/storage";

export default class PasteRenamePlugin extends Plugin {
  settings: PasteRenameSettings = DEFAULT_SETTINGS;
  private storage!: AssetStorage;
  private controller!: PasteDropController;

  async onload(): Promise<void> {
    await this.loadPluginSettings();

    this.storage = new AssetStorage(this.app, () => this.settings, createDefaultCompressor());
    this.controller = new PasteDropController(this.app, () => this.settings, this.storage);
    this.controller.register(this);

    this.addSettingTab(new PasteRenameSettingTab(this.app, this));
  }

  async updateSettings(patch: Partial<PasteRenameSettings>): Promise<void> {
    const next = coerceSettings({ ...this.settings, ...patch });
    validateSettings(next);
    this.settings = next;
    await this.saveData(this.settings);
  }

  private async loadPluginSettings(): Promise<void> {
    const loaded = (await this.loadData()) as Partial<PasteRenameSettings> | null;
    const merged = coerceSettings({ ...DEFAULT_SETTINGS, ...(loaded ?? {}) });

    try {
      validateSettings(merged);
      this.settings = merged;
    } catch {
      this.settings = DEFAULT_SETTINGS;
      new Notice("Paste rename settings were invalid and have been reset to defaults.");
      await this.saveData(this.settings);
    }
  }
}
