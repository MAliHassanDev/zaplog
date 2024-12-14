import { getDefaultLoggerOptions, getTimeStamp } from "./util.js";

/* eslint-disable @typescript-eslint/restrict-template-expressions */
export interface Level {
  error: 0;
  warn: 1;
  info: 2;
  debug: 3;
}

type Context = string | null;

export interface LoggerOptions {
  level: keyof Level;
  errorStack: boolean;
}

class Logger {
  private readonly levels: Level = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  };

  private readonly levelColorCodes: Record<keyof Level, number> = {
    error: 31,
    warn: 93,
    info: 32,
    debug: 35,
  };

  private readonly level: keyof Level;

  private readonly errorStack: boolean;

  constructor(options: LoggerOptions = getDefaultLoggerOptions()) {
    this.level = options.level;
    this.errorStack = options.errorStack;
  }

  private log(level: keyof Level, message: unknown, context: Context) {
    const currentLevelIndex = this.levels[level];
    const setLevelIndex = this.levels[this.level];

    const shouldLog =
      process.env.NODE_ENV !== "production" &&
      currentLevelIndex <= setLevelIndex;

    if (!shouldLog) return;

    const colorCode = this.levelColorCodes[level];
    const isError = message instanceof Error && this.errorStack;

    const logHeader = `${getTimeStamp()} \x1B[${colorCode};1;1m${level}:\x1B[0m`;
    const logContext = context ? ` [${context}]` : "";
    const logMessage = isError ? message.stack : message;

    console.log(`${logHeader}${logContext} ${logMessage}`);
  }

  public info = (message: string, context: Context = null) => {
    this.log("info", message, context);
  };

  public error = (message: unknown, context: Context = null) => {
    this.log("error", message, context);
  };

  public warn = (message: string, context: Context = null) => {
    this.log("warn", message, context);
  };

  public debug = (message: string, context: Context = null) => {
    this.log("debug", message, context);
  };
}

export default new Logger();

