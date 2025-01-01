/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
import { describe, vi, it, expect, beforeEach, MockInstance } from "vitest";
import Logger, { Level, LoggerOption } from "../src/logger.js";
import { existsSync } from "fs";
import { join } from "path";
import { readFile, stat } from "fs/promises";

describe("Logger", () => {
  describe("given default options", () => {
    let spy: MockInstance;
    let message: string;
    beforeEach(() => {
      spy = createLogSpy();
      message = createLogMessage();
    });
    it("prints message with timeStamp to console", () => {
      createLogger().info(message);
      expect(vi.mocked(spy)).toHaveBeenCalled();
      expect(vi.mocked(spy).mock.calls[0][0]).toMatch(createTimeStamp());
      expect(vi.mocked(spy).mock.calls[0][0]).toMatch(message);
    });

    it("prints message with called method name", () => {
      createLogger().info(message);
      expect(vi.mocked(spy)).toHaveBeenCalled();
      expect(vi.mocked(spy).mock.calls[0][0]).toMatch(/info/);
      expect(vi.mocked(spy).mock.calls[0][0]).toMatch(message);
    });

    it("creates logs dir in project root", () => {
      createLogger();
      const dir = join(process.cwd(), "logs");
      expect(existsSync(dir)).toBeTruthy();
    });

    it("creates default log files in default  directory", () => {
      createLogger();
      const { logFiles } = new LoggerOption().getDefault();
      Promise.all(
        Object.values(logFiles).map(filePath =>
          stat(filePath)
            .then(() => true)
            .catch(() => false),
        ),
      )
        .then(files => {
          expect(files.every(file => file)).toBeTruthy();
        })
        .catch(console.error);
    });

    it("writes log with level warn in default file", () => {
      const message = "Warning mock message";
      createLogger().warn(message);
      const { logFiles } = new LoggerOption().getDefault();
      readFile(logFiles.warn, "utf-8")
        .then((logs: string) => {
          expect(logs).toMatch(message);
        })
        .catch(console.error);
    });

    it("writes log with level info in default file", () => {
      const message = "Info mock message";
      createLogger().warn(message);
      const { logFiles } = new LoggerOption().getDefault();
      readFile(logFiles.info, "utf-8")
        .then((logs: string) => {
          expect(logs).toMatch(message);
        })
        .catch(console.error);
    });

    it("writes log with level debug in default file", () => {
      const message = "Debug mock message";
      createLogger().warn(message);
      const { logFiles } = new LoggerOption().getDefault();
      readFile(logFiles.debug, "utf-8")
        .then((logs: string) => {
          expect(logs).toMatch(message);
        })
        .catch(console.error);
    });

    it("writes log with level error in default file", () => {
      const message = "Error mock message";
      createLogger().warn(message);
      const { logFiles } = new LoggerOption().getDefault();
      readFile(logFiles.error, "utf-8")
        .then((logs: string) => {
          expect(logs).toMatch(message);
        })
        .catch(console.error);
    });
  });
  describe("given level debug", () => {
    let spy: MockInstance;
    const message = createLogMessage();

    beforeEach(() => {
      spy = createLogSpy();
    });

    it("on info method call, prints the message and log level to console", () => {
      createLogger("debug").info(message);
      expect(spy).toHaveBeenCalled();
      expect(vi.mocked(spy).mock.calls[0][0]).toMatch(message);
      expect(vi.mocked(spy).mock.calls[0][0]).toMatch(/info:/);
    });

    it("on warn method call, prints the message with log level  to console", () => {
      createLogger("debug").warn(message);
      expect(spy).toHaveBeenCalled();
      expect(vi.mocked(spy).mock.calls[0][0]).toMatch(message);
      expect(vi.mocked(spy).mock.calls[0][0]).toMatch(/warn:/);
    });

    it("on debug method call, prints the message with log level to console", () => {
      createLogger("debug").debug(message);
      expect(spy).toHaveBeenCalled();
      expect(vi.mocked(spy).mock.calls[0][0]).toMatch(message);
      expect(vi.mocked(spy).mock.calls[0][0]).toMatch(/debug:/);
    });

    it("on error method call,prints the message,title and error stack to console", () => {
      const error = new Error(message);
      createLogger("debug").error(error);

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
      createLogger("info").debug(message);
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
      createLogger("warn").debug(message);
      expect(spy).not.toHaveBeenCalled();
    });

    it("on info method call, doesn't prints anything to console", () => {
      createLogger("warn").info(message);
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
      createLogger("error").info(message);
      expect(spy).not.toHaveBeenCalled();
    });

    it("on debug method call, doesn't prints anything to console", () => {
      createLogger("error").debug(message);
      expect(spy).not.toHaveBeenCalled();
    });

    it("on warn method call, doesn't prints anything to console", () => {
      createLogger("error").warn(message);
      expect(spy).not.toHaveBeenCalled();
    });

    it("on error method call,prints the message,title and error stack to console", () => {
      const error = new Error(message);
      createLogger("error").error(error);
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
      createLogger("error", false).error(error);
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

function createLogger(level: Level = "info", errorStack?: boolean) {
  return new Logger({ level, errorStack });
}

function createLogMessage() {
  return "mock message";
}

function createLogSpy() {
  return vi.spyOn(console, "log");
}

function createTimeStamp() {
  const date = new Date();

  // Format date components
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  // Format time components
  const hours = date.getHours();
  const hours12 = String(hours > 12 ? hours - 12 : hours).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours12}:${minutes}:${seconds}`;
}
