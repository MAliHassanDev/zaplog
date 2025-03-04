import { getLogLevelBasedOnEnv } from "../../utils/util.js";
import { BaseLoggerConfig, Level, Logger } from "../baseLogger.js";
import { getBrowserEnv } from "./browser.util.js";

type BrowserLoggerConfig = Partial<BaseLoggerConfig>;

export  class BrowserLogger extends Logger {
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
