# Paste Rename

Paste Rename is an Obsidian plugin that intercepts paste/drop file input, stores assets using a dynamic template, and inserts links using your current Obsidian link style (Wikilink or Markdown).

## Features

- Intercepts paste and drop events in Markdown editor.
- Uses one unified `assetPattern` template for folder + filename generation.
- Supports variables: `{{YYYY}} {{YY}} {{MM}} {{DD}} {{HH}} {{mm}} {{ss}} {{FILENAME}} {{UUID}} {{HASH:n}}`.
- Deduplicates automatically by regenerating unique tokens.
- Inserts links according to Obsidian `Use [[Wikilinks]]` setting.
- Optional lossless PNG compression (disabled by default).

## Installation (manual)

1. Build the plugin:
   - `npm ci`
   - `npm run build`
2. Copy these files to your vault plugin folder:
   - `manifest.json`
   - `main.js`
   - `styles.css`
3. Target folder name should match plugin id:
   - `.obsidian/plugins/paste-rename/`
4. Enable **Paste Rename** in Community plugins.

## Development

- `npm run dev`: watch build
- `npm run build`: production build
- `npm test`: run unit tests

## Releasing with GitHub Actions

This repo includes `.github/workflows/release.yml`.

Release flow:

1. Bump version with npm (auto-syncs `manifest.json` and `versions.json`):
   - `npm version patch`
   - or `npm version minor`
   - or `npm version major`
2. Push commit and tag:
   - `git push origin main --tags`
3. GitHub Actions builds and publishes release assets:
   - `manifest.json`
   - `main.js`
   - `styles.css`
   - `paste-rename-<version>.zip`

## Submitting to Obsidian Community Plugins

After first release is published on GitHub:

1. Open a PR to `obsidianmd/obsidian-releases`.
2. Add your plugin entry to `community-plugins.json` with:
   - `id`: `paste-rename`
   - `name`: `Paste Rename`
   - `author`: `rookie`
   - `repo`: `https://github.com/rookie-ricardo/obsidian-paste-rename`
3. Wait for review and merge.
