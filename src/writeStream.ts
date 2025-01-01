import { createWriteStream, existsSync, mkdirSync, WriteStream } from "node:fs";
import * as path from "node:path";

class WriterStream {
  private readonly writeStream: WriteStream;
  private isStreamOpen: boolean;

  public constructor(filePath: string) {
    this.makeDirIfNotExists(filePath);
    this.writeStream = createWriteStream(filePath, { flags: "a" });
    this.isStreamOpen = true;
  }

  public write(data: string) {
    if (!this.isStreamOpen) return;
    this.writeStream.write(Buffer.from(data + "\n"), err => {
      if (err) {
        console.error(
          "Error while writing log to file. Closing stream....",
          err,
        );
        this.close();
      }
    });
  }

  public close() {
    this.writeStream.end((err: unknown) => {
      if (err) {
        console.error("Error while closing write stream.", err);
      } else {
        this.isStreamOpen = false;
        console.warn("WriteStream closed.");
      }
    });
  }

  public destroy() {
    this.writeStream.destroy();
  }

  private makeDirIfNotExists(filePath: string) {
    const dirPath = path.dirname(filePath);
    if (!existsSync(dirPath)) mkdirSync(dirPath, { recursive: true });
  }
}

export default WriterStream;
