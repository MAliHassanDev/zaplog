import { Level, LoggerOptions } from "./logger";

type NodeEnv = "development" | "production" | "test";

export function getTimeStamp() {
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  const currDate = date.getDate();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${currDate}-${month}-${year} ${
    hour > 12 ? hour - 12 : hour
  }:${minutes}:${seconds}`;
}

export function getDefaultLoggerOptions(): LoggerOptions {
  return {
    level: getDefaultLogLevel(),
    errorStack: true,
  };
}

function getDefaultLogLevel() {
  const env = process.env.NODE_ENV as NodeEnv;
  let level: keyof Level;
  switch (env) {
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
