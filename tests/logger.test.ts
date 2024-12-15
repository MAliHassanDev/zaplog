import { describe, vi, it, expect, beforeEach, afterEach } from "vitest";
import Logger, { LoggerOptions } from "../src/logger";

describe("Logger", () => {
  describe("given level info", () => {
    const spy = vi.spyOn(console, "log");
    let logger: Logger;
    let message: string;

    beforeEach(() => {
      message = "mock message";
      logger = new Logger({ level: "info" });
    });

    afterEach(() => {
      vi.resetAllMocks();
    });
    it("on info method call logs the message with title info to console", () => {
      logger.info(message);
      expect(spy).toHaveBeenCalled();
      expect(vi.mocked(spy).mock.calls[0][0]).toMatch(message);
      expect(vi.mocked(spy).mock.calls[0][0]).toMatch(/info/);
    });

    it("on warn method call, logs the message with title warn to console", () => {
      logger.warn(message);
      expect(spy).toHaveBeenCalled();
      expect(vi.mocked(spy).mock.calls[0][0]).toMatch(message);
      expect(vi.mocked(spy).mock.calls[0][0]).toMatch(/warn/);
    });
  });
});

describe("LoggerOptions", () => {
  describe("in development environment", () => {
    it("returns default dev options", () => {
      const defaultOptions = {
        level: "info",
        errorStack: true,
      };
      const loggerOptions = new LoggerOptions("development");
      expect(loggerOptions.getDefault()).toMatchObject(defaultOptions);
    });
  });

  describe("in production environment", () => {
    it("returns default prod options", () => {
      const defaultOptions = {
        level: "warn",
        errorStack: true,
      };
      const loggerOptions = new LoggerOptions("production");
      expect(loggerOptions.getDefault()).toMatchObject(defaultOptions);
    });
  });

  describe("in testing environment", () => {
    it("returns default test options", () => {
      const defaultOptions = {
        level: "error",
        errorStack: true,
      };
      const loggerOptions = new LoggerOptions("test");
      expect(loggerOptions.getDefault()).toMatchObject(defaultOptions);
    });
  });
});
