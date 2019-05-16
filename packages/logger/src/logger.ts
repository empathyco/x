import { Logger, LogLevel } from './logger.interfaces';
import { SimpleLogger } from './simple-logger';

export const logger: Logger = new SimpleLogger();
logger.serverLevel = LogLevel.silent;
