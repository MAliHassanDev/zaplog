import path, { join } from "path";
import { NodeEnv } from "../types/logger.types.js";
import { existsSync, mkdir, mkdirSync } from "fs";

export function getNodeEnv(): NodeEnv {
  return (process.env.NODE_ENV as NodeEnv | null) ?? "development";
}

export function getDefaultLogFilesConfig() {
  const logsDir = join(process.cwd(), "logs");
  return {
    error: join(logsDir, "errors.log"),
    warn: join(logsDir, "warnings.log"),
    info: join(logsDir, "combined.log"),
    debug: join(logsDir, "combined.log"),
    combined: join(logsDir, "combined.log"),
  };
}

export function makeDirIfNotExists(dirPath: string) {
  if (!existsSync(dirPath)) mkdirSync(dirPath, { recursive: true });
}
