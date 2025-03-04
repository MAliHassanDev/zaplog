import { isEnvironmentNode } from "./utils/util.js";

const Logger = isEnvironmentNode()
  ? (await import("./logger/node/nodeLogger.js")).NodeLogger
  : (await import("./logger/browser/browserLogger.js")).BrowserLogger;

export default Logger;
