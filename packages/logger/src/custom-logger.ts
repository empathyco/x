import { Logger, LogLevel } from './logger.interfaces';

export class CustomLogger implements Logger {
  private static commonConsoleLevel: LogLevel = LogLevel.warn;
  private static commonServerLevel: LogLevel = LogLevel.error;
  private readonly instanceTags: any[] = [];

  constructor(...args: any[]) {
    this.instanceTags = args;
  }

  set consoleLevel(level: LogLevel) {
    CustomLogger.commonConsoleLevel = level;
  }

  get consoleLevel() {
    return CustomLogger.commonConsoleLevel;
  }

  set serverLevel(level: LogLevel) {
    CustomLogger.commonServerLevel = level;
  }

  get serverLevel() {
    return CustomLogger.commonServerLevel;
  }

  error(...args: any[]) {
    this.log(LogLevel.error, args);
  }

  warn(...args: any[]) {
    this.log(LogLevel.warn, args);
  }

  info(...args: any[]) {
    this.log(LogLevel.info, args);
  }

  debug(...args: any[]) {
    this.log(LogLevel.debug, args);
  }

  trace(...args: any[]) {
    this.log(LogLevel.trace, args);
  }

  child(...args: any[]): Logger {
    return new CustomLogger(...this.instanceTags, ...args);
  }

  private log(level: LogLevel, args: any[]) {
    if (this.consoleLevel >= level) {
      this.sendLogToConsole(level, ...this.instanceTags.concat(args));
    }
    if (this.serverLevel >= level) {
      this.sendLogToServer(level, ...this.instanceTags.concat(args));
    }
  }

  private sendLogToConsole(level: LogLevel, ...args: any[]) {
    const consoleFunctionName: keyof typeof console = LogLevel[level] as any;
    // To prevent failure on old browsers
    if (console[consoleFunctionName]) {
      console[consoleFunctionName](...args);
    } else {
      console.log(...args);
    }
  }

  private sendLogToServer(level: LogLevel, ...args: any[]) {
    console.log(LogLevel[level], 'sending to server...', ...args);
  }
}
