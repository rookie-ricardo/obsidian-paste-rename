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
