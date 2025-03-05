import { getLogLevelBasedOnEnv } from "../../utils/util.js";
import { BaseLogger } from "../baseLogger.js";
import { BrowserLoggerConfig, Level } from "../types/logger.types.js";
import { getBrowserEnv } from "./browser.util.js";

export class BrowserLogger extends BaseLogger {
  constructor({ level, errorStack }: BrowserLoggerConfig = {}) {
    level = level ?? getLogLevelBasedOnEnv(getBrowserEnv());
    errorStack = errorStack ?? true;
    super({ level, errorStack });
  }

  protected log(
    level: Level,
    message: unknown,
    context: string | null,
    ...optionalParams: Array<unknown>
  ): void {
    this.logToConsole(level, message, context, ...optionalParams);
  }
}
