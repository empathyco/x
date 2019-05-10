import { CustomLogger } from './custom-logger';
import { Logger, LogLevel } from './logger.interfaces';

export const logger: Logger = new CustomLogger('%cEmpathyX',
  'background-color:#c50953;color:#ffffff;border-radius:3px;padding:3px 10px;font-weight:bold');
logger.serverLevel = LogLevel.silent;
