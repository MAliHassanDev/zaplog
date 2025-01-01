import { beforeEach, describe, expect, it } from "vitest";
import WriterStream from "../src/writeStream.js";
import { join } from "path";
import { existsSync, rmSync } from "fs";

describe("WriteStream", () => {
  describe("given file path", () => {
    beforeEach(() => {
      const { dirPath } = getLogFileLocation();
      if (existsSync(dirPath)) {
        rmSync(dirPath, { recursive: true, force: true });
      }
    });
    it("creates target dir if it not exits", () => {
      const { filePath, dirPath } = getLogFileLocation();
      expect(existsSync(dirPath)).toBeFalsy();
      const stream = new WriterStream(filePath);
      expect(existsSync(dirPath)).toBeTruthy();
      stream.close();
      stream.destroy();
    });
  });
});

function getLogFileLocation() {
  const fileName = "testMock.txt";
  const dirPath = join(import.meta.dirname, "logs");

  return {
    fileName: "testMock.text",
    dirPath,
    filePath: join(dirPath, fileName),
  } as const;
}
