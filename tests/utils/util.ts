import { existsSync, rmSync } from "node:fs";

export function removeDirIfExist(dirPath: string): boolean {
  let dirFoundAndRemoved = false;
  if (existsSync(dirPath)) {
    rmSync(dirPath, { recursive: true, force: true });
    dirFoundAndRemoved = true;
  }
  return dirFoundAndRemoved;
}
