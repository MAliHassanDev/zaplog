import {
  BrowserLoggerConfig,
  LoggerEnvironment,
  Logger,
  NodeLoggerConfig,
} from "./logger/types/logger.types.js";

import { NodeLogger } from "./logger/node/nodeLogger.js";

export function createLogger(
  loggerEnvironment: "browser",
  config?: BrowserLoggerConfig,
): Logger;
export function createLogger(
  loggerEnvironment?: "node",
  config?: NodeLoggerConfig,
): Logger;
export function createLogger(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loggerEnvironment: LoggerEnvironment = "node",
  config?: BrowserLoggerConfig | NodeLoggerConfig,
) {
  return new NodeLogger(config) as Logger;
}

export * from "./logger/types/logger.types.js";
