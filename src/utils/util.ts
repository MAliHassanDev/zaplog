import { Level, NodeEnv } from "../logger/types/logger.types.js";

export function getTimeStamp(
  format = "dd-MM-yyyy hh:mm:ss",
  date: Date = new Date(),
) {
  const hours24 = date.getHours();
  const hours12 = hours24 > 12 ? hours24 - 12 : hours24;
  return format.replace(
    /(yyyy)?(MM)?(dd)?(HH)?(hh)?(mm)?(ss)?(a)?/g,
    (match: string) => {
      switch (match) {
        case "yyyy":
          return `${date.getFullYear()}`;
        case "MM":
          return transformIn2Digit(date.getMonth() + 1);
        case "dd":
          return transformIn2Digit(date.getDate());
        case "HH":
          return `${hours24}`;
        case "hh":
          return transformIn2Digit(hours12);
        case "mm":
          return transformIn2Digit(date.getMinutes());
        case "ss":
          return transformIn2Digit(date.getSeconds());
        case "a":
          return hours24 >= 12 ? "PM" : "AM";
        default:
          return "";
      }
    },
  );
}

export function transformIn2Digit(num: number): string {
  return `${num}`.padStart(2, "0");
}

export function isEnvironmentNode() {
  return typeof process !== "undefined";
}

export function getLogLevelBasedOnEnv(env: NodeEnv): Level {
  let level: Level;
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
