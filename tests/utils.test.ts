import { it, describe, expect } from "vitest";
import {
  getDefaultLoggerOptions,
  getLogLevel,
  getTimeStamp,
  NodeEnv,
  transformIn2Digit,
} from "../src/util";
import { LoggerOptions } from "../src/logger";

describe("getLogLevel", () => {
  it("returns 'info' on invalid env", () => {
    expect(getLogLevel("invalid" as NodeEnv)).toBe("info");
  });

  it("returns 'info' when env is development", () => {
    expect(getLogLevel("development")).toBe("info");
  });

  it("returns 'warn' when env is production", () => {
    expect(getLogLevel("production")).toBe("warn");
  });

  it("returns 'error' when env is test", () => {
    expect(getLogLevel("test")).toBe("error");
  });
});

describe("getDefaultLoggerOptions", () => {
  it("returns default logger options on valid env", () => {
    const defaultOptions: LoggerOptions = {
      level: "info",
      errorStack: true,
    };
    expect(getDefaultLoggerOptions("development")).toEqual(defaultOptions);
  });
});
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
    const date = new Date();
    const stamp = `${transformIn2Digit(date.getDate())}-${transformIn2Digit(date.getMonth())}-${date.getFullYear()}`;
    expect(getTimeStamp("dd-MM-yyyy", date)).toBe(stamp);
  });
});
