import { describe, expect, it } from "vitest";
import { buildReferenceLink } from "../src/writeback";

describe("writeback syntax follows app setting", () => {
  it("uses wikilinks when useMarkdownLinks is false", () => {
    const app = {
      vault: {
        getConfig: (key: string) => (key === "useMarkdownLinks" ? false : undefined),
      },
    };

    expect(buildReferenceLink(app as never, "09-Assets/a.png", true)).toBe("![[09-Assets/a.png]]");
    expect(buildReferenceLink(app as never, "09-Assets/a.pdf", false)).toBe("[[09-Assets/a.pdf]]");
  });

  it("uses markdown links when useMarkdownLinks is true", () => {
    const app = {
      vault: {
        getConfig: (key: string) => (key === "useMarkdownLinks" ? true : undefined),
      },
    };

    expect(buildReferenceLink(app as never, "09-Assets/a.png", true)).toBe("![](<09-Assets/a.png>)");
    expect(buildReferenceLink(app as never, "09-Assets/a.pdf", false)).toBe("[a.pdf](<09-Assets/a.pdf>)");
  });
});
