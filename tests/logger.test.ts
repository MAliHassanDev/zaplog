/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
import { describe, vi, it, expect, beforeEach, MockInstance } from "vitest";
import Logger, { LoggerOption, Options } from "../src/logger.js";
import { existsSync } from "fs";
import { dirname } from "path";
import { removeDirIfExist } from "./utils/util.js";

describe("Logger", () => {
  describe("when loggerFiles option is set to false", () => {
    it("doesn't creates log dir in project root", () => {
      removeDirIfExist(getDefaultLogDir());
      createLogger({ logFiles: false });
      expect(existsSync(getDefaultLogDir())).toBeFalsy();
    });
  });

  describe("given level debug", () => {
    let spy: MockInstance;
    const message = createLogMessage();

    beforeEach(() => {
      spy = createLogSpy();
    });

    it("on info method call, prints the message and log level to console", () => {
      createLogger({ level: "debug", logFiles: false }).info(message);
      expect(spy).toHaveBeenCalled();
      expect(vi.mocked(spy).mock.calls[0][0]).toMatch(message);
      expect(vi.mocked(spy).mock.calls[0][0]).toMatch(/info:/);
    });

    it("on warn method call, prints the message with log level  to console", () => {
      createLogger({ level: "debug", logFiles: false }).warn(message);
      expect(spy).toHaveBeenCalled();
      expect(vi.mocked(spy).mock.calls[0][0]).toMatch(message);
      expect(vi.mocked(spy).mock.calls[0][0]).toMatch(/warn:/);
    });

    it("on debug method call, prints the message with log level to console", () => {
      createLogger({ level: "debug", logFiles: false }).debug(message);
      expect(spy).toHaveBeenCalled();
      expect(vi.mocked(spy).mock.calls[0][0]).toMatch(message);
      expect(vi.mocked(spy).mock.calls[0][0]).toMatch(/debug:/);
    });

    it("on error method call,prints the message,title and error stack to console", () => {
      const error = new Error(message);
      createLogger({ level: "debug", logFiles: false }).error(error);

      expect(spy).toHaveBeenCalled();
      expect(vi.mocked(spy).mock.calls[0][0]).toMatch(message);
      expect(vi.mocked(spy).mock.calls[0][0]).toMatch(error.stack as string);
      expect(vi.mocked(spy).mock.calls[0][0]).toMatch(/error:/);
    });
  });

  describe("given level info", () => {
    let spy: MockInstance;
    let message: string;

    beforeEach(() => {
      spy = createLogSpy();
      message = createLogMessage();
    });

    it("on debug method call, doesn't prints anything to console", () => {
      createLogger({ level: "info", logFiles: false }).debug(message);
      expect(spy).not.toHaveBeenCalled();
    });
  });
  describe("given level warn", () => {
    let spy: MockInstance;
    let message: string;

    beforeEach(() => {
      spy = createLogSpy();
      message = createLogMessage();
    });

    it("on debug method call, doesn't prints anything to console", () => {
      createLogger({ level: "warn", logFiles: false }).debug(message);
      expect(spy).not.toHaveBeenCalled();
    });

    it("on info method call, doesn't prints anything to console", () => {
      createLogger({ level: "warn", logFiles: false }).info(message);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe("given level error", () => {
    let spy: MockInstance;
    let message: string;

    beforeEach(() => {
      spy = createLogSpy();
      message = createLogMessage();
    });

    it("on info method call, doesn't prints anything to console", () => {
      createLogger({ level: "error", logFiles: false }).info(message);
      expect(spy).not.toHaveBeenCalled();
    });

    it("on debug method call, doesn't prints anything to console", () => {
      createLogger({ level: "error", logFiles: false }).debug(message);
      expect(spy).not.toHaveBeenCalled();
    });

    it("on warn method call, doesn't prints anything to console", () => {
      createLogger({ level: "error", logFiles: false }).warn(message);
      expect(spy).not.toHaveBeenCalled();
    });

    it("on error method call,prints the message,title and error stack to console", () => {
      const error = new Error(message);
      createLogger({ level: "error", logFiles: false }).error(error);
      expect(spy).toHaveBeenCalled();
      expect(vi.mocked(spy).mock.calls[0][0]).toMatch(message);
      expect(vi.mocked(spy).mock.calls[0][0]).toMatch(error.stack as string);
      expect(vi.mocked(spy).mock.calls[0][0]).toMatch(/error:/);
    });
  });

  describe("given disable error stack option", () => {
    let spy: MockInstance;
    let message: string;

    beforeEach(() => {
      spy = createLogSpy();
      message = createLogMessage();
    });
    it("doesn't prints the error stack to the console", () => {
      const error = new Error(message);
      createLogger({
        level: "error",
        errorStack: false,
        logFiles: false,
      }).error(error);
      expect(spy).toHaveBeenCalled();
      expect(vi.mocked(spy).mock.calls[0][0]).not.toMatch(
        error.stack as string,
      );
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
      const loggerOptions = new LoggerOption("development");
      expect(loggerOptions.getDefault()).toMatchObject(defaultOptions);
    });
  });

  describe("in production environment", () => {
    it("returns default prod options", () => {
      const defaultOptions = {
        level: "warn",
        errorStack: true,
      };
      const loggerOptions = new LoggerOption("production");
      expect(loggerOptions.getDefault()).toMatchObject(defaultOptions);
    });
  });

  describe("in testing environment", () => {
    it("returns default test options", () => {
      const defaultOptions = {
        level: "error",
        errorStack: true,
      };
      const loggerOptions = new LoggerOption("test");
      expect(loggerOptions.getDefault()).toMatchObject(defaultOptions);
    });
  });
});

function createLogger(options: Options = {}) {
  return new Logger(options);
}

function createLogMessage() {
  return "mock message";
}

function createLogSpy() {
  return vi.spyOn(console, "log");
}
function getDefaultLogDir() {
  const logFilePath = new LoggerOption().getDefault().logFiles.combined;
  const dir = dirname(logFilePath);
  return dir;
}
