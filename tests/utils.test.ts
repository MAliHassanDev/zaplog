import { it, describe, expect } from "vitest";
import { getTimeStamp, transformIn2Digit } from "../src/util.js";

describe("transformIn2Digit", () => {
  it("returns number in 2 digit format if number is less than 10", () => {
    expect(transformIn2Digit(6)).toBe("06");
  });

  it("return the same number in string if number is greater than 10", () => {
    expect(transformIn2Digit(11)).toBe("11");
  });
});

describe("getTimeStamp", () => {
  it("returns timeStamp in the given format", () => {
    const date = new Date("02-23-2021");
    const stamp = "23-02-2021";
    expect(getTimeStamp("dd-MM-yyyy", date)).toBe(stamp);
  });
});
