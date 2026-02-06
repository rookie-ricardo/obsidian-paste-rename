import { describe, expect, it } from "vitest";
import { createTemplateContext, renderTemplate, validateTemplate } from "../src/template";

describe("template rendering", () => {
  it("renders date and filename tokens", () => {
    const context = createTemplateContext("Daily Note", new Date("2026-01-02T03:04:05"));
    const output = renderTemplate("{{YYYY}}-{{MM}}-{{DD}}-{{HH}}-{{mm}}-{{ss}}-{{FILENAME}}", context);
    expect(output).toBe("2026-01-02-03-04-05-Daily Note");
  });

  it("renders HASH with requested length and lowercase hex", () => {
    const context = createTemplateContext("Any", new Date("2026-01-02T03:04:05"));
    const output = renderTemplate("{{HASH:16}}", context);
    expect(output).toMatch(/^[a-f0-9]{16}$/);
  });

  it("rejects invalid HASH length", () => {
    expect(() => validateTemplate("{{HASH:0}}", "Name template")).toThrow("between 1 and 64");
    expect(() => validateTemplate("{{HASH:65}}", "Name template")).toThrow("between 1 and 64");
  });

  it("rejects unsupported token", () => {
    expect(() => validateTemplate("{{UNKNOWN}}", "Name template")).toThrow("unsupported token");
  });
});
