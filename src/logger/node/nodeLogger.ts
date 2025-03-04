import { writeFile } from "node:fs/promises";
import { getLogLevelBasedOnEnv } from "../../utils/util.js";
import { BaseLoggerConfig, Level, LogEntry, Logger } from "../baseLogger.js";
import { getDefaultLogFilesConfig, getNodeEnv } from "./node.util.js";

type LogFiles = Partial<Record<Level, string>> & {
  combined: string;
};

type NodeLoggerConfig = Partial<BaseLoggerConfig> & {
  logFiles?: LogFiles | boolean;
};

export class NodeLogger extends Logger {
  private readonly logFiles: LogFiles | false;

  public constructor({ level, errorStack, logFiles }: NodeLoggerConfig = {}) {
    level = level ?? getLogLevelBasedOnEnv(getNodeEnv());
    errorStack = errorStack ?? true;

    super({ level, errorStack });

    this.logFiles =
      logFiles == true || logFiles == undefined
        ? getDefaultLogFilesConfig()
        : logFiles;
  }

  protected log(
    level: Level,
    message: unknown,
    context: string | null,
    ...optionalParams: Array<unknown>
  ): void {
    this.logToConsole(level, message, context, optionalParams);
    if (!this.logFiles) return;
    const logEntry = this.formatLogEntry(level, message, context);

    const filePath = this.logFiles[level] ?? this.logFiles.combined;
    void this.writeLogToFile(filePath, logEntry);
  }

  private async writeLogToFile(filePath: string, logEntry: LogEntry) {
    try {
      await writeFile(filePath, JSON.stringify(logEntry), {
        encoding: "utf-8",
        flag: "a",
      });
    } catch (err: unknown) {
      console.error("Error occurred while writing log to file", err);
    }
  }
}
