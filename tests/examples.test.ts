import { describe, expect, it } from "vitest";
import { categories, examples, findExampleById, filterExamples } from "@/lib/examples";

describe("prompt examples", () => {
  it("ships with the curated premium template set", () => {
    expect(examples).toHaveLength(32);
    expect(examples.map((item) => item.id)).toEqual([
      "awesome-case-5",
      "awesome-case-8",
      "awesome-case-9",
      "awesome-case-11",
      "awesome-case-41",
      "awesome-case-50",
      "awesome-case-85",
      "awesome-case-84",
      "awesome-case-88",
      "awesome-case-94",
      "awesome-case-131",
      "awesome-case-54",
      "awesome-case-130",
      "awesome-case-155",
      "awesome-case-156",
      "awesome-case-381",
      "awesome-case-211",
      "awesome-case-187",
      "awesome-case-113",
      "awesome-case-452",
      "awesome-case-27",
      "awesome-case-206",
      "awesome-case-207",
      "awesome-case-251",
      "awesome-case-248",
      "awesome-case-243",
      "awesome-case-238",
      "awesome-case-230",
      "awesome-case-229",
      "awesome-case-224",
      "awesome-case-222",
      "awesome-case-218"
    ]);
    expect(examples.every((item) => item.sampleImageUrl.startsWith("/examples/awesome-case-"))).toBe(true);
  });

  it("finds an example by id", () => {
    expect(findExampleById("awesome-case-5")?.title).toBe("主题海报版式设计");
    expect(findExampleById("awesome-case-41")?.title).toBe("插画艺术风格创作");
    expect(findExampleById("missing")).toBeNull();
  });

  it("filters by category and search query", () => {
    expect(filterExamples({ category: "信息图", query: "青花瓷" }).map((item) => item.id)).toEqual([
      "awesome-case-248"
    ]);
    expect(filterExamples({ category: "UI", query: "界面" }).map((item) => item.id)).toEqual([
      "awesome-case-131",
      "awesome-case-156",
      "awesome-case-243"
    ]);
  });

  it("keeps 全部 as the first category", () => {
    expect(categories[0]).toBe("全部");
    expect(categories).toContain("信息图");
    expect(categories).toContain("空间");
    expect(categories).toContain("UI");
    expect(categories).toContain("人物");
    expect(categories).toContain("插画");
    expect(categories).toContain("场景");
  });
});
