import { NodeEnv } from "../types/logger.types.js";

declare global {
  interface ImportMetaEnv {
    readonly MODE?: NodeEnv;
  }

  interface ImportMeta {
    readonly env?: ImportMetaEnv;
  }
}

export function getBrowserEnv() {
  return import.meta.env?.MODE ?? "development";
}
