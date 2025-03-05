import {
  BrowserLoggerConfig,
  LoggerEnvironment,
  Logger,
  NodeLoggerConfig,
} from "./logger/types/logger.types.js";
import { isEnvironmentNode } from "./utils/util.js";

const Logger = isEnvironmentNode()
  ? (await import("./logger/node/nodeLogger.js")).NodeLogger
  : (await import("./logger/browser/browserLogger.js")).BrowserLogger;

export function createLogger(
  loggerEnvironment: "browser",
  config?: BrowserLoggerConfig,
): Logger;
export function createLogger(
  loggerEnvironment: "node",
  config?: NodeLoggerConfig,
): Logger;
export function createLogger(
  loggerEnvironment: LoggerEnvironment,
  config?: BrowserLoggerConfig | NodeLoggerConfig,
) {
  return new Logger(config) as Logger;
}
