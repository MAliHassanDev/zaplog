# Zaplog

Zaplog is a minimalist logging library designed to work out of the box with zero
configurations. It provides four log levels (`info`, `error`, `warn`, `debug`)
and writes log messages to files (except in production).

[![Version npm](https://img.shields.io/npm/v/zaplog.svg?style=flat-square)](https://www.npmjs.com/package/zaplog)
[![npm Downloads](https://img.shields.io/npm/dm/zaplog.svg?style=flat-square)](https://npmcharts.com/compare/zaplog?minimal=true)

## [![NPM](https://nodei.co/npm/zaplog.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/zaplog)

## Installation

Install Zaplog using npm or yarn:

```bash
npm install zaplog
```

## Usage

### Basic Usage

Here’s how to get started with Zaplog:

```js
import Logger from "zaplog";

const logger = new Logger();

// Log messages
logger.info("This is an info message");
logger.error("An error occurred");
logger.warn("This is a warning");
logger.debug("Debugging information");
```

### Additional Context to Log Messages

You can provide additional context to log messages for more clarity. Use the
optional context parameter in the logging methods:

```js
logger.info("User logged in", "AuthService");
logger.error("Database connection failed", "DBService");
```

In the above example, AuthService and DBService are contexts that help identify
the source of the log messages.

## Features

- **Minimalist Design:** Works out of the box with sensible defaults.
- **Browser support:** Works in browser and node.
- **Flexible Log Levels:** Supports `info`, `error`, `warn`, and `debug` levels.
- **Environment-Sensitive Defaults:** Adjusts logging behavior based on the
  environment (`development`, `test`, `production`).
- **File Writing:** Automatically writes logs to categorized files.
- **Error Stack Traces:** Includes error stack traces for deeper insights.
- **Zero Configuration:** No need for initial setup; just import and start
  logging.

---

## Logging

### Log levels

Zaplog supports four log levels with varying levels of severity:

| Level   | Code | Description                                   |
| ------- | ---- | --------------------------------------------- |
| `error` | 0    | Critical issues requiring immediate attention |
| `warn`  | 1    | Non-critical issues that might need attention |
| `info`  | 2    | General informational messages                |
| `debug` | 3    | Detailed information useful for debugging     |

Logs with a severity higher than the current environment level will not be
recorded. For example, if the level is set to `warn`, only `warn` and `error`
logs will be processed.

### Environment-Specific Behavior

Default log level based on the environment:

- `development` : `info`
- `test` : `error`
- `production` : `warn`
- **Default** : `info`

You can override these defaults by configuring the library (see below).

## Configuration

Zaplog is designed to work out of the box, but you can customize its behavior by
passing configuration options to the `Logger` constructor.

### Default Options
If no configuration is provided, following default options are used:

```js
{
  level: 'info', // Default log level based on the environment
  errorStack: true, // Includes stack traces in error logs
  logFiles: false,
}
```
if environment is node and logFiles is set to true then these defaults are used:

```json
logFiles: {
    error: "${projectRoot}/logs/errors.log"),
    warn: "${projectRoot}/logs/warnings.log"),
    info: "${projectRoot}/logs/combined.log"),
    debug: "${projectRoot}/logs/combined.log"),
    combined: "${projectRoot}/logs/combined.log"),
}
```
Where projectRoot is equal to absolute path to you project root.

### Custom Configuration

To customize the logging behavior, pass an options object as second argument

```ts
import {createLogger} from "zaplog";

const logger = createLogger("node",{
  level: "debug",
  errorStack: false,
  logFiles: {
    error: "/custom-logs/errors.log",
    warn: "/custom-logs/warnings.log",
    info: "/custom-logs/info.log",
    debug: "/custom-logs/debug.log",
    combined: "/custom-logs/combined.log",
  },
});

logger.info("Custom configuration applied!");

File path should be absolute e.g
`path.join(import.meta.dirname,"logs/custom.log")`
```
For Browser: 
```ts
import {createLogger} from "zaplog";

const logger = createLogger("node",{
  level: "debug",
  errorStack: false,
});

logger.info("Custom configuration applied!");
```
## Contributing

We welcome contributions to improve this project! If you'd like to contribute,
follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push to your branch (`git push origin feature-name`).
5. Create a pull request.

Please ensure your code adheres to the existing coding standards and includes
tests where applicable.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

## 🧭 Navigation

- My previous project
  [Microservices Backend](https://github.com/MAliHassanDev/microservices-ecommerce)
