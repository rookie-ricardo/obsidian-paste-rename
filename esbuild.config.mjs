import esbuild from "esbuild";

const production = process.argv[2] === "production";
const workerSource = await buildCompressionWorkerSource();

const context = await esbuild.context({
  entryPoints: ["main.ts"],
  bundle: true,
  format: "cjs",
  target: "es2020",
  logLevel: "info",
  sourcemap: production ? false : "inline",
  treeShaking: true,
  outfile: "main.js",
  loader: {
    ".wasm": "binary",
  },
  plugins: [inlineCompressionWorkerPlugin(workerSource)],
  external: ["obsidian", "electron", "@codemirror/state", "@codemirror/view", "@codemirror/language"],
});

if (production) {
  await context.rebuild();
  await context.dispose();
} else {
  await context.watch();
}

async function buildCompressionWorkerSource() {
  const result = await esbuild.build({
    entryPoints: ["src/compress-worker.ts"],
    bundle: true,
    write: false,
    format: "iife",
    platform: "browser",
    target: "es2020",
    minify: production,
    loader: {
      ".wasm": "binary",
    },
  });

  const [output] = result.outputFiles;
  if (!output) {
    throw new Error("Failed to build compression worker.");
  }

  return output.text;
}

function inlineCompressionWorkerPlugin(source) {
  return {
    name: "inline-compression-worker",
    setup(build) {
      build.onResolve({ filter: /^virtual:compress-worker-source$/ }, () => ({
        path: "virtual:compress-worker-source",
        namespace: "inline-worker",
      }));

      build.onLoad({ filter: /.*/, namespace: "inline-worker" }, () => ({
        contents: `export default ${JSON.stringify(source)};`,
        loader: "js",
      }));
    },
  };
}
