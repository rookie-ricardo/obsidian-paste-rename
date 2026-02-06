# Paste Rename

> Obsidian plugin for "paste/drop and archive immediately" workflow.  
> Obsidian 插件：粘贴/拖拽即归档，按模板命名并自动回写链接。

## 中文说明

### 这是什么

Paste Rename 会拦截 Markdown 编辑器中的 `Paste` / `Drop` 文件输入流，把文件按你定义的模板保存到 Vault，然后在光标处插入链接。

适用场景：

- 截图频繁，文件名混乱
- 希望附件按日期归档
- 希望文件名包含 UUID / HASH 避免冲突
- 希望链接语法跟随 Obsidian 的 Wikilink/Markdown 设置

### 示例（先看这个）

#### 示例 1：推荐模板

`assetPattern`：

```txt
09-Assets/{{YYYY}}-{{MM}}/{{YYYY}}{{MM}}{{DD}}-{{FILENAME}}-{{HASH:16}}
```

假设：

- 当前时间：`2026-02-07 15:32:10`
- 当前笔记名：`测试文件.md`
- 粘贴文件：`png`

生成文件路径：

```txt
09-Assets/2026-02/20260207-测试文件-c7c8d9e0f1a2b3c4.png
```

插入链接（取决于 Obsidian 设置）：

- 开启 `Use [[Wikilinks]]`：`![[09-Assets/2026-02/20260207-测试文件-c7c8d9e0f1a2b3c4.png]]`
- 关闭 `Use [[Wikilinks]]`：`![](<09-Assets/2026-02/20260207-测试文件-c7c8d9e0f1a2b3c4.png>)`

#### 示例 2：更简短模板

`assetPattern`：

```txt
assets/{{YYYY}}/{{MM}}/{{FILENAME}}-{{UUID}}
```

可能结果：

```txt
assets/2026/02/测试文件-123e4567-e89b-12d3-a456-426614174000.png
```

### 模板变量

- `{{YYYY}} {{YY}} {{MM}} {{DD}} {{HH}} {{mm}} {{ss}}`：当前本地时间
- `{{FILENAME}}`：当前笔记名（去掉 `.md`，并做文件名安全处理）
- `{{UUID}}`：随机 UUID v4
- `{{HASH:n}}`：随机十六进制字符串，`n` 范围 `1..64`

### 主要功能

- 仅在 Markdown 编辑器中拦截粘贴/拖拽
- 单一 `assetPattern` 同时定义目录和文件名
- 自动去重（冲突时重生唯一段；无唯一变量时补 `-HASH8`）
- 自动插入链接，并跟随 Obsidian 链接风格设置
- 可选无损 PNG 压缩（默认关闭，仅对 PNG 生效）

### 安装（手动）

1. 构建插件：
   - `npm ci`
   - `npm run build`
2. 将以下文件复制到你的 Vault：
   - `manifest.json`
   - `main.js`
   - `styles.css`
3. 目录必须是：
   - `.obsidian/plugins/paste-rename/`
4. 在 Obsidian 中启用插件：
   - `Settings -> Community plugins -> Paste Rename`

### 开发命令

- `npm run dev`：监听构建
- `npm run build`：生产构建
- `npm test`：单元测试

### 发布（GitHub Actions）

仓库已内置：`.github/workflows/release.yml`

流程：

1. 版本升级（会自动同步 `manifest.json` 和 `versions.json`）：
   - `npm version patch`
   - 或 `npm version minor`
   - 或 `npm version major`
2. 推送提交和 tag：
   - `git push origin main --tags`
3. Actions 自动发布 release 资产：
   - `manifest.json`
   - `main.js`
   - `styles.css`
   - `paste-rename-<version>.zip`

### 提交到 Obsidian 社区插件

1. 先确保 GitHub 上已有 Release。
2. 到 `obsidianmd/obsidian-releases` 提 PR。
3. 在 `community-plugins.json` 增加：
   - `id`: `paste-rename`
   - `name`: `Paste Rename`
   - `author`: `rookie`
   - `repo`: `https://github.com/rookie-ricardo/obsidian-paste-rename`
4. 等待审核合并。

---

## English

### What this plugin does

Paste Rename intercepts `Paste` and `Drop` file input in Markdown editor, stores files by a single template, and inserts links at cursor position.

Best for users who want:

- clean attachment naming
- time-based asset folders
- true uniqueness (`UUID` / random `HASH`)
- link output that follows Obsidian link preference

### Examples (quick start)

#### Example 1: Recommended pattern

`assetPattern`:

```txt
09-Assets/{{YYYY}}-{{MM}}/{{YYYY}}{{MM}}{{DD}}-{{FILENAME}}-{{HASH:16}}
```

Assume:

- time: `2026-02-07 15:32:10`
- active note: `Test Note.md`
- pasted file type: `png`

Generated file path:

```txt
09-Assets/2026-02/20260207-Test Note-c7c8d9e0f1a2b3c4.png
```

Inserted link:

- With `Use [[Wikilinks]]` enabled:  
  `![[09-Assets/2026-02/20260207-Test Note-c7c8d9e0f1a2b3c4.png]]`
- With `Use [[Wikilinks]]` disabled:  
  `![](<09-Assets/2026-02/20260207-Test Note-c7c8d9e0f1a2b3c4.png>)`

#### Example 2: Short pattern

```txt
assets/{{YYYY}}/{{MM}}/{{FILENAME}}-{{UUID}}
```

Possible output:

```txt
assets/2026/02/Test Note-123e4567-e89b-12d3-a456-426614174000.png
```

### Variables

- `{{YYYY}} {{YY}} {{MM}} {{DD}} {{HH}} {{mm}} {{ss}}`: local timestamp
- `{{FILENAME}}`: active note filename without `.md`, sanitized
- `{{UUID}}`: random UUID v4
- `{{HASH:n}}`: random lowercase hex, `n` in `1..64`

### Key features

- Intercepts paste/drop in Markdown editor
- One unified `assetPattern` for folder + filename
- Automatic dedupe
- Link insertion follows Obsidian link style
- Optional lossless PNG compression (off by default, PNG only)

### Manual installation

1. Build:
   - `npm ci`
   - `npm run build`
2. Copy to your vault plugin folder:
   - `manifest.json`
   - `main.js`
   - `styles.css`
3. Folder name must match plugin id:
   - `.obsidian/plugins/paste-rename/`
4. Enable **Paste Rename** in Community plugins.

### Development

- `npm run dev`: watch build
- `npm run build`: production build
- `npm test`: unit tests

### Releasing with GitHub Actions

Workflow: `.github/workflows/release.yml`

1. Bump version:
   - `npm version patch` / `minor` / `major`
2. Push commit and tag:
   - `git push origin main --tags`
3. Release assets are uploaded automatically:
   - `manifest.json`
   - `main.js`
   - `styles.css`
   - `paste-rename-<version>.zip`

### Community submission

After the first GitHub release:

1. Open a PR to `obsidianmd/obsidian-releases`.
2. Add your plugin entry to `community-plugins.json`:
   - `id`: `paste-rename`
   - `name`: `Paste Rename`
   - `author`: `rookie`
   - `repo`: `https://github.com/rookie-ricardo/obsidian-paste-rename`
3. Wait for review and merge.
