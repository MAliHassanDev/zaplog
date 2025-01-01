import { join } from "node:path";
import { getEnv, getTimeStamp, NodeEnv } from "./util.js";
import WriteStream from "./writeStream.js";
import WriterStream from "./writeStream.js";

export type Level = "error" | "warn" | "info" | "debug";

export interface LevelCode {
  error: 0;
  warn: 1;
  info: 2;
  debug: 3;
}

type Context = string | null;

type LogFiles = Partial<Record<Level, string>> & {
  combined: string;
};

interface LogObject {
  level: Level;
  message: string;
  time: string;
  context?: Context;
  stack?: string;
}

export interface Options {
  readonly level?: Level;
  readonly errorStack?: boolean;
  readonly logFiles?: LogFiles | boolean;
}

class Logger {
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

  private readonly logFiles: LogFiles | boolean;

  private writeStreamMap: Map<keyof LogFiles, WriteStream> | null = null;

  constructor({ level, errorStack, logFiles }: Options = {}) {
    const defaultOptions = new LoggerOption(getEnv()).getDefault();
    this.level = level ?? defaultOptions.level;
    this.errorStack = errorStack ?? defaultOptions.errorStack;
    this.logFiles =
      logFiles == true || logFiles == undefined
        ? defaultOptions.logFiles
        : logFiles;
  }

  private log(level: Level, message: unknown, context: Context) {
    const currentLevelIndex = this.levels[level];
    const setLevelIndex = this.levels[this.level];

    const shouldLog =
      process.env.NODE_ENV !== "production" &&
      currentLevelIndex <= setLevelIndex;

    if (!shouldLog) return;

    const logObject = this.createLogObject(level, message, context);
    const logString = this.createLogString(logObject);
    console.log(logString);

    if (typeof this.logFiles == "boolean") return;

    if (!this.writeStreamMap) {
      this.writeStreamMap = this.createWriteStreamsMap(this.logFiles);
    }
    const stream =
      this.writeStreamMap.get(level) ?? this.writeStreamMap.get("combined");
    if (!stream) return;
    this.writeLogToFile(stream, logObject);
  }

  private createLogObject(level: Level, message: unknown, context: Context) {
    const isError = message instanceof Error;
    const logObject: LogObject = {
      level,
      message: isError ? message.message : (message as string),
      time: getTimeStamp(),
    };
    const errorStack = isError && this.errorStack ? message.stack : null;
    if (context !== null) logObject.context = context;
    if (errorStack) logObject.stack = errorStack;
    return logObject;
  }

  private createLogString({ level, message, context, stack, time }: LogObject) {
    const colorCode = this.levelColorCodes[level];

    const logHeader = `${time} \x1B[${colorCode};1;1m${level}:\x1B[0m`;
    const logContext = context ? ` [${context}]` : "";
    return `${logHeader}${logContext} ${message} ${stack ?? ""}`;
  }

  private writeLogToFile(stream: WriteStream, logObject: LogObject) {
    try {
      stream.write(JSON.stringify(logObject));
    } catch (err: unknown) {
      console.error("Error occurred while writing log to file", err);
    }
  }

  private createWriteStreamsMap(logFiles: LogFiles) {
    const map = new Map<keyof LogFiles, WriteStream>();
    for (const [key, filePath] of Object.entries(logFiles) as Array<
      [keyof LogFiles, string]
    >) {
      const stream = new WriterStream(filePath);
      map.set(key, stream);
    }
    return map;
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

export class LoggerOption {
  public constructor(private readonly env: NodeEnv = "development") {}

  public getDefault() {
    const logsDir = join(process.cwd(), "logs");
    return {
      level: this.getLogLevel(),
      errorStack: true,
      logFiles: {
        error: join(logsDir, "errors.log"),
        warn: join(logsDir, "warnings.log"),
        info: join(logsDir, "combined.log"),
        debug: join(logsDir, "combined.log"),
        combined: join(logsDir, "combined.log"),
      },
    };
  }

  private getLogLevel() {
    let level: Level;
    switch (this.env) {
      case "development":
        level = "info";
        break;
      case "test":
        level = "error";
        break;
      case "production":
        level = "warn";
        break;
      default:
        level = "info";
    }
    return level;
  }
}

export default Logger;
