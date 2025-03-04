import { join } from "path";
import { NodeEnv } from "../../types/types.js";

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
