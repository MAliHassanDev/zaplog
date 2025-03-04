import { NodeEnv } from "../../types/types.js";

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
