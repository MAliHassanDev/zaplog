import { describe, expect, it } from "vitest";
import { createLogger as createNodeLogger } from "../src/index.js";
import { BaseLogger } from "../src/logger/baseLogger.js";
import { NodeLogger } from "../src/logger/node/nodeLogger.js";
import { createLogger as createBrowserLogger } from "../src/browser.js";
import { BrowserLogger } from "../src/logger/browser/browserLogger.js";

describe("createLogger", () => {
  describe("imported from node.js", () => {
    it("returns instance of nodeLogger", () => {
      const logger = createNodeLogger("node");
      expect(logger).toBeInstanceOf(BaseLogger);
      expect(logger).toBeInstanceOf(NodeLogger);
    });
  });

  describe("imported from browser.js", () => {
    it("returns instance of browserLogger", () => {
      const logger = createBrowserLogger("browser");
      expect(logger).toBeInstanceOf(BaseLogger);
      expect(logger).toBeInstanceOf(BrowserLogger);
    });
  });
});
