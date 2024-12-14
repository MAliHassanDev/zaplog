import { describe, it, expect } from "vitest";

describe("test", () => {
  it("should pass", () => {
    expect.assertions(1);
    expect(10).toBe(10);
  });

  it("should also pass", () => {
    expect.assertions(1);
    expect(10).toBe(10);
  });
});
