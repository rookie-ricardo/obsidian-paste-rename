# Paste Rename

[English](README.md) | [中文](README.zh-CN.md)

Paste Rename 是一个用于 Obsidian 的“粘贴/拖拽即归档”插件。  
它会在 Markdown 编辑器中拦截文件输入，按一个统一模板保存附件，并根据 Obsidian 链接偏好自动插入引用。

## 功能特性

- 在 Markdown 编辑器中拦截 `Paste` / `Drop`。
- 使用单一 `assetPattern` 同时定义目录和文件名。
- 支持变量：`{{YYYY}} {{YY}} {{MM}} {{DD}} {{HH}} {{mm}} {{ss}} {{FILENAME}} {{UUID}} {{HASH:n}}`。
- 自动去重：冲突时重生唯一段。
- 回写链接语法跟随 Obsidian `Use [[Wikilinks]]` 设置。
- 可选无损 PNG 压缩（默认关闭，仅对 PNG 生效）。

## 模板示例

### 示例 1（推荐）

`assetPattern`：

```txt
09-Assets/{{YYYY}}-{{MM}}/{{YYYY}}{{MM}}{{DD}}-{{FILENAME}}-{{HASH:16}}
```

假设：

- 当前时间：`2026-02-07 15:32:10`
- 当前笔记：`测试文件.md`
- 粘贴文件类型：`png`

生成路径：

```txt
09-Assets/2026-02/20260207-测试文件-c7c8d9e0f1a2b3c4.png
```

插入链接：

- 开启 `Use [[Wikilinks]]`：
  `![[09-Assets/2026-02/20260207-测试文件-c7c8d9e0f1a2b3c4.png]]`
- 关闭 `Use [[Wikilinks]]`：
  `![](<09-Assets/2026-02/20260207-测试文件-c7c8d9e0f1a2b3c4.png>)`

### 示例 2（简洁）

`assetPattern`：

```txt
assets/{{YYYY}}/{{MM}}/{{FILENAME}}-{{UUID}}
```

可能结果：

```txt
assets/2026/02/测试文件-123e4567-e89b-12d3-a456-426614174000.png
```

## 变量说明

- `{{YYYY}} {{YY}} {{MM}} {{DD}} {{HH}} {{mm}} {{ss}}`：本地时间
- `{{FILENAME}}`：当前笔记文件名（去掉 `.md` 并做安全处理）
- `{{UUID}}`：随机 UUID v4
- `{{HASH:n}}`：随机小写十六进制字符串，`n` 范围 `1..64`

## 手动安装

1. 构建插件：
   - `npm ci`
   - `npm run build`
2. 复制以下文件到你的 vault 插件目录：
   - `manifest.json`
   - `main.js`
   - `styles.css`
3. 目录名必须与插件 id 一致：
   - `.obsidian/plugins/paste-rename/`
4. 在 Community plugins 中启用 **Paste Rename**。

## 开发命令

- `npm run dev`：监听构建
- `npm run build`：生产构建
- `npm test`：运行单元测试

## 使用 GitHub Actions 发布

工作流文件：`.github/workflows/release.yml`

1. 升级版本：
   - `npm version patch`
   - 或 `npm version minor`
   - 或 `npm version major`
2. 推送提交和 tag：
   - `git push origin main --tags`
3. GitHub Actions 自动上传发布资产：
   - `manifest.json`
   - `main.js`
   - `styles.css`
   - `paste-rename-<version>.zip`

## 提交到 Obsidian 社区插件

首次 GitHub Release 完成后：

1. 向 `obsidianmd/obsidian-releases` 提交 PR。
2. 在 `community-plugins.json` 中添加：
   - `id`: `paste-rename`
   - `name`: `Paste Rename`
   - `author`: `rookie`
   - `repo`: `rookie-ricardo/obsidian-paste-rename`
3. 等待审核与合并。

## 社区审核问题记录（本项目真实踩坑）

### PR / 条目校验问题（`obsidian-releases` PR）

- PR 描述必须严格使用官方模板并勾选清单，否则校验失败。
- 新插件条目必须追加到 `community-plugins.json` 最末尾。
- PR 里的插件描述需与仓库 `manifest.json`、最新 Release 信息保持一致。
- 插件短描述中不要包含 `Obsidian` 这个词。
- Release 的 tag/标题必须与 `manifest.json` 版本号完全一致（不能带 `v` 前缀）。

### 自动代码扫描问题（`ObsidianReviewBot`）

- 设置页 UI 文案要使用 sentence case（句式大小写风格）。
- 设置页标题中不要再写插件名。
- 标题要用 `new Setting(containerEl).setName(...).setHeading()`，不要手写 HTML heading。
- 删除不改变类型的多余类型断言。
- 避免在正则中使用会触发规则的控制字符（例如 `\\x00`、`\\x1f`）。
- 清理未使用变量（包括未使用的 `catch` 参数）。

### 重新提交前自检

- 发一个新的 patch 版本，并确认 Release 附件包含 `main.js`、`manifest.json`、`styles.css`。
- 若描述或版本相关信息有改动，同步更新 `community-plugins.json` 条目。
- 向 fork 的 PR 分支再推一个提交，触发 `plugin-validation` 重新校验。
