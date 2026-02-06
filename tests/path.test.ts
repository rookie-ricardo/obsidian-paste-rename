import { describe, expect, it } from "vitest";
import { buildDirectoryPath, buildFileName, getNoteBaseName, resolveFileExtension, sanitizeFileNamePart } from "../src/path";

describe("path helpers", () => {
  it("sanitizes illegal filename characters", () => {
    expect(sanitizeFileNamePart('bad:/\\*?"name')).toBe("bad------name");
  });

  it("builds directory with prefix and rendered template", () => {
    expect(buildDirectoryPath("assets/", "09-Assets/2026-01/")).toBe("assets/09-Assets/2026-01");
  });

  it("builds file name with safe extension", () => {
    expect(buildFileName("report final", ".PDF")).toBe("report final.pdf");
  });

  it("extracts note base name from full path", () => {
    expect(getNoteBaseName("notes/Week Plan.md")).toBe("Week Plan");
  });

  it("resolves extension from mime when name has no extension", () => {
    const ext = resolveFileExtension({ name: "clipboard", type: "application/pdf" });
    expect(ext).toBe("pdf");
  });
});
