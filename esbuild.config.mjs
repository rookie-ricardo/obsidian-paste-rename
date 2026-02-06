import esbuild from "esbuild";

const production = process.argv[2] === "production";

const context = await esbuild.context({
  entryPoints: ["main.ts"],
  bundle: true,
  format: "cjs",
  target: "es2020",
  logLevel: "info",
  sourcemap: production ? false : "inline",
  treeShaking: true,
  outfile: "main.js",
  external: ["obsidian", "electron", "@codemirror/state", "@codemirror/view", "@codemirror/language"],
});

if (production) {
  await context.rebuild();
  await context.dispose();
} else {
  await context.watch();
}
