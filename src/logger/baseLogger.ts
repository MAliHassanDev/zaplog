import { getTimeStamp, isEnvironmentNode } from "../utils/util.js";
import { getBrowserEnv } from "./browser/browser.util.js";
import {
  BaseLoggerConfig,
  Context,
  Level,
  Logger,
} from "./types/logger.types.js";

export interface LevelCode {
  error: 0;
  warn: 1;
  info: 2;
  debug: 3;
}

export interface LogEntry {
  level: Level;
  message: string;
  time: string;
  context?: Context;
  stack?: string;
}

export abstract class BaseLogger implements Logger {
  private readonly levels: LevelCode = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  };

  private readonly levelColorCodes: Record<Level, number> = {
    error: 31,
    warn: 93,
    info: 32,
    debug: 35,
  };

  private readonly level: Level;

  private readonly errorStack: boolean;

  constructor({ level, errorStack }: BaseLoggerConfig) {
    this.level = level;
    this.errorStack = errorStack;
  }

  protected abstract log(
    level: Level,
    message: unknown,
    context?: Context,
    optionalParams?: Array<unknown>,
  ): void;

  protected logToConsole(
    level: Level,
    message: unknown,
    context?: Context,
    optionalParams?: Array<unknown>,
  ) {
    const currentLevelIndex = this.levels[level];
    const setLevelIndex = this.levels[this.level];

    const env = isEnvironmentNode() ? process.env.NODE_ENV : getBrowserEnv();

    const shouldLogToConsole =
      env !== "production" && currentLevelIndex <= setLevelIndex;

    if (!shouldLogToConsole) return;

    const logEntry = this.formatLogEntry(level, message, context);

    const logHeader = this.createLogHeader(logEntry);

    if (optionalParams && optionalParams.length > 0) {
      console.log(
        logHeader,
        message,
        logEntry.stack ? logEntry.stack : "",
        optionalParams,
      );
    } else {
      console.log(logHeader, message, logEntry.stack ? logEntry.stack : "");
    }
  }

  protected formatLogEntry(level: Level, message: unknown, context?: Context) {
    const isError = message instanceof Error;

    const logEntry: LogEntry = {
      level,
      message: isError ? message.message : (message as string),
      time: getTimeStamp(),
    };

    const errorStack = isError && this.errorStack ? message.stack : null;

    if (context) logEntry.context = context;
    if (errorStack) logEntry.stack = errorStack;
    return logEntry;
  }

  private createLogHeader({
    level,
    context,
    time,
  }: Omit<LogEntry, "message" | "stack">) {
    const colorCode = this.levelColorCodes[level];

    const logHeader = `${time} \x1B[${colorCode};1;1m${level}:\x1B[0m`;
    const logContext = context ? ` [${context}]` : "";
    return `${logHeader}${logContext}`;
  }

  public info = (message: unknown, context: Context) => {
    this.log("info", message, context);
  };

  public error = (
    message: unknown,
    context?: Context,
    ...optionalParams: Array<unknown>
  ) => {
    this.log("error", message, context, optionalParams);
  };

  public warn = (message: string, context?: Context) => {
    this.log("warn", message, context);
  };

  public debug = (
    message: unknown,
    context?: Context,
    ...optionalParams: Array<unknown>
  ) => {
    this.log("debug", message, context, optionalParams);
  };
}
