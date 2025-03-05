import { writeFile } from "node:fs/promises";
import { getLogLevelBasedOnEnv } from "../../utils/util.js";
import { LogEntry, BaseLogger } from "../baseLogger.js";
import {
  getDefaultLogFilesConfig,
  getNodeEnv,
  makeDirIfNotExists,
} from "./node.util.js";
import { dirname } from "node:path";
import { Level, LogFiles, NodeLoggerConfig } from "../types/logger.types.js";

export class NodeLogger extends BaseLogger {
  private readonly logFiles: LogFiles | false | undefined;

  public constructor({ level, errorStack, logFiles }: NodeLoggerConfig = {}) {
    level = level ?? getLogLevelBasedOnEnv(getNodeEnv());
    errorStack = errorStack ?? true;

    super({ level, errorStack });

    this.logFiles = logFiles == true ? getDefaultLogFilesConfig() : logFiles;

    if (this.logFiles) {
      Object.values(this.logFiles).forEach(filePath => {
        makeDirIfNotExists(dirname(filePath));
      });
    }
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
