import { describe, expect, it } from "vitest";
import { createLogger } from "../src/index.js";
import { BaseLogger } from "../src/logger/baseLogger.js";
import { NodeLogger } from "../src/logger/node/nodeLogger.js";

describe("createLogger", () => {
  describe("in node environment", () => {
    it("returns instance of nodeLogger", () => {
      const logger = createLogger("node");
      expect(logger).toBeInstanceOf(BaseLogger);
      expect(logger).toBeInstanceOf(NodeLogger);
    });
  });
});
