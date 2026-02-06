# Community Submission Checklist

Use this checklist when submitting **Paste Rename** to Obsidian Community Plugins.

## 1. Confirm repository readiness

- [ ] `manifest.json` has valid `id`, `name`, `version`, `minAppVersion`.
- [ ] `versions.json` includes the released version.
- [ ] GitHub release exists with:
  - [ ] `manifest.json`
  - [ ] `main.js`
  - [ ] `styles.css`

## 2. Prepare plugin entry for `obsidianmd/obsidian-releases`

Add an object in `community-plugins.json`:

```json
{
  "id": "paste-rename",
  "name": "Paste Rename",
  "author": "rookie",
  "description": "Intercept paste/drop files, archive with dynamic path and UUID/HASH naming, and insert links following Obsidian link style.",
  "repo": "https://github.com/rookie-ricardo/obsidian-paste-rename"
}
```

## 3. Open PR to `obsidianmd/obsidian-releases`

- [ ] Title includes plugin name.
- [ ] PR body includes repository and release link.
- [ ] Confirm first release tag exists and matches `manifest.json` version.
