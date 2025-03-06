export type NodeEnv = "development" | "production" | "test";

export type Level = "error" | "warn" | "info" | "debug";

export type LoggerEnvironment = "browser" | "node";

export type Context = string;

export interface Logger {
  info(message: string, context?: Context): void;

  error(
    message: unknown,
    context?: Context,
    ...optionalParams: Array<unknown>
  ): void;

  warn(message: string, context?: Context): void;

  debug(
    message: unknown,
    context?: Context,
    ...optionalParams: Array<unknown>
  ): void;
}

export interface BaseLoggerConfig {
  readonly level: Level;
  readonly errorStack: boolean;
}

export type BrowserLoggerConfig = Partial<BaseLoggerConfig>;

export type LogFiles = Partial<Record<Level, string>> & {
  combined: string;
};

export type NodeLoggerConfig = Partial<BaseLoggerConfig> & {
  logFiles?: LogFiles | boolean;
};
