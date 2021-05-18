# X Logger

This project is a simple logger

### Installation

You can install the logger using NPM:

```
npm install @empathyco/x-logger --save-dev
```

### Usage

```
import { logger, LogLevel } from '@empathyco/x-logger';
```

There are different log levels to be set in the console level and server level.

```
enum LogLevel {
  silent = 0,
  error = 1,
  warn = 2,
  info = 3,
  debug = 4,
  trace = 5
}
```

And different methods to be called to use the logger:

```
logger.error()
logger.warn()
logger.info()
logger.debug()
logger.trace()
```

Depending on the LogLevel, only some levels will be displayed in the console. Setting the LogLevel to `warn`, the console will display the levels below it and itself, in this case, `error` and `warn`.
```
logger.consoleLevel = LogLevel.warn;

logger.error() // console.error called
logger.warn() // console.warn called
logger.info() // console.info not called
logger.debug() // console.debug  not called
logger.trace() // console.trace not called
```

