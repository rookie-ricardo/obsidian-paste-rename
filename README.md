# Paste Rename

[English](README.md) | [中文](README.zh-CN.md)

Paste Rename is an Obsidian plugin for a "paste/drop and archive immediately" workflow.
It intercepts file input in Markdown editor, stores files using one dynamic pattern, and inserts links that follow your Obsidian link style.

## Features

- Intercepts `Paste` and `Drop` in Markdown editor.
- Uses one unified `assetPattern` for folder + filename generation.
- Supports variables: `{{YYYY}} {{YY}} {{MM}} {{DD}} {{HH}} {{mm}} {{ss}} {{FILENAME}} {{UUID}} {{HASH:n}}`.
- Automatically deduplicates names by regenerating unique segments.
- Inserts links following Obsidian `Use [[Wikilinks]]` preference.
- Optional lossless PNG compression (disabled by default; PNG only).

## Pattern Examples

### Example 1 (Recommended)

`assetPattern`:

```txt
09-Assets/{{YYYY}}-{{MM}}/{{YYYY}}{{MM}}{{DD}}-{{FILENAME}}-{{HASH:16}}
```

Assume:

- Current time: `2026-02-07 15:32:10`
- Active note: `Test Note.md`
- Pasted file type: `png`

Output path:

```txt
09-Assets/2026-02/20260207-Test Note-c7c8d9e0f1a2b3c4.png
```

Inserted link:

- With `Use [[Wikilinks]]` enabled:
  `![[09-Assets/2026-02/20260207-Test Note-c7c8d9e0f1a2b3c4.png]]`
- With `Use [[Wikilinks]]` disabled:
  `![](<09-Assets/2026-02/20260207-Test Note-c7c8d9e0f1a2b3c4.png>)`

### Example 2 (Short)

`assetPattern`:

```txt
assets/{{YYYY}}/{{MM}}/{{FILENAME}}-{{UUID}}
```

Possible output:

```txt
assets/2026/02/Test Note-123e4567-e89b-12d3-a456-426614174000.png
```

## Variables

- `{{YYYY}} {{YY}} {{MM}} {{DD}} {{HH}} {{mm}} {{ss}}`: local timestamp
- `{{FILENAME}}`: active note filename without `.md`, sanitized
- `{{UUID}}`: random UUID v4
- `{{HASH:n}}`: random lowercase hex, `n` in `1..64`

## Manual Installation

1. Build the plugin:
   - `npm ci`
   - `npm run build`
2. Copy files to your vault plugin directory:
   - `manifest.json`
   - `main.js`
   - `styles.css`
3. Ensure the folder name matches plugin id:
   - `.obsidian/plugins/paste-rename/`
4. Enable **Paste Rename** in Community plugins.

## Development

- `npm run dev`: watch build
- `npm run build`: production build
- `npm run lint`: run official Obsidian ESLint checks (`eslint-plugin-obsidianmd`)
- `npm run lint:fix`: auto-fix lint findings when possible
- `npm test`: run unit tests

## Releasing with GitHub Actions

Workflow file: `.github/workflows/release.yml`

1. Bump version:
   - `npm version patch`
   - or `npm version minor`
   - or `npm version major`
2. Push commit and tag:
   - `git push origin main --tags`
3. GitHub Actions will upload release assets:
   - `manifest.json`
   - `main.js`
   - `styles.css`
   - `paste-rename-<version>.zip`

## Submit to Obsidian Community Plugins

After first GitHub release:

1. Open a PR to `obsidianmd/obsidian-releases`.
2. Add plugin entry in `community-plugins.json`:
   - `id`: `paste-rename`
   - `name`: `Paste Rename`
   - `author`: `rookie`
   - `repo`: `rookie-ricardo/obsidian-paste-rename`
3. Wait for review and merge.

## Community Review Notes (Real Issues We Hit)

### PR / Entry validation issues (`obsidian-releases` PR)

- PR body must follow the official template exactly (with checklist). Otherwise validation fails.
- New plugin entry must be appended at the end of `community-plugins.json`.
- Plugin description in PR context must match `manifest.json` and latest GitHub release metadata.
- Do not include the word `Obsidian` in the short plugin description text.
- Release tag / release title must match the exact version number in `manifest.json` (no `v` prefix).

### Automated code scan issues (`ObsidianReviewBot`)

- Use sentence case for settings UI text.
- Do not include plugin name in settings headings.
- Use `new Setting(containerEl).setName(...).setHeading()` instead of creating heading HTML directly.
- Remove unnecessary type assertions that do not change expression type.
- Avoid control characters in regular expressions (for example `\\x00`, `\\x1f` in lint-sensitive contexts).
- Remove unused variables (including unused `catch` params).

### Re-submission checklist

- Release a new patch version and publish assets (`main.js`, `manifest.json`, `styles.css`).
- Update `community-plugins.json` entry if description/version-related text changed.
- Push a new commit to your fork PR branch to retrigger `plugin-validation`.
