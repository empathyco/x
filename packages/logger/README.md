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
logger.consoleLevel = LogLevel.warn;
logger.serverLevel = LogLevel.error;
```

And finally, different methods to be used

```
logger.error()
logger.warn()
logger.info()
logger.debug()
logger.trace()
```
