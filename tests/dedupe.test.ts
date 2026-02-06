import { describe, expect, it } from "vitest";
import { resolveUniqueVaultPath } from "../src/storage";
import { TemplateContext } from "../src/template";

describe("dedupe path resolution", () => {
  it("regenerates unique token templates until non-existing path", async () => {
    const generatedUuids = ["uuid-a", "uuid-b"];
    let index = 0;

    const path = await resolveUniqueVaultPath({
      settings: {
        assetPattern: "09-Assets/{{YYYY}}-{{MM}}/file-{{UUID}}",
      },
      noteBaseName: "My Note",
      extension: "png",
      exists: async (candidate) => candidate.endsWith("file-uuid-a.png"),
      contextFactory: (_name, date) => {
        const uuid = generatedUuids[index] ?? `uuid-${index}`;
        index += 1;
        return {
          date,
          fileNameBase: "My Note",
          uuid,
          randomHex: () => "abcd1234",
        };
      },
      now: () => new Date("2026-01-02T03:04:05"),
    });

    expect(path).toBe("09-Assets/2026-01/file-uuid-b.png");
  });

  it("adds fallback hash suffix when template has no unique tokens", async () => {
    let attempt = 0;

    const path = await resolveUniqueVaultPath({
      settings: {
        assetPattern: "09-Assets/{{YYYY}}-{{MM}}/fixed-name",
      },
      noteBaseName: "My Note",
      extension: "png",
      exists: async (candidate) => {
        attempt += 1;
        return attempt === 1 && candidate.endsWith("fixed-name.png");
      },
      contextFactory: (_name, date): TemplateContext => ({
        date,
        fileNameBase: "My Note",
        uuid: "irrelevant",
        randomHex: () => "deadbeef",
      }),
      now: () => new Date("2026-01-02T03:04:05"),
    });

    expect(path).toBe("09-Assets/2026-01/fixed-name-deadbeef.png");
  });

  it("throws when all attempts collide", async () => {
    await expect(
      resolveUniqueVaultPath({
        settings: {
          assetPattern: "09-Assets/{{YYYY}}-{{MM}}/fixed",
        },
        noteBaseName: "My Note",
        extension: "png",
        exists: async () => true,
        maxAttempts: 3,
        contextFactory: (_name, date) => ({
          date,
          fileNameBase: "My Note",
          uuid: "u",
          randomHex: () => "deadbeef",
        }),
        now: () => new Date("2026-01-02T03:04:05"),
      }),
    ).rejects.toThrow("Could not generate a unique filename");
  });
});
