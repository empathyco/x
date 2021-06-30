import { Logger, LogLevel } from './logger.interfaces';

export class SimpleLogger implements Logger {
  private static commonConsoleLevel: LogLevel = LogLevel.warn;
  private static commonServerLevel: LogLevel = LogLevel.error;
  private readonly instanceTags: any[] = [];

  public constructor(...args: any[]) {
    this.instanceTags = args;
  }

  public set consoleLevel(level: LogLevel) {
    SimpleLogger.commonConsoleLevel = level;
  }

  public get consoleLevel(): LogLevel {
    return SimpleLogger.commonConsoleLevel;
  }

  public set serverLevel(level: LogLevel) {
    SimpleLogger.commonServerLevel = level;
  }

  public get serverLevel(): LogLevel {
    return SimpleLogger.commonServerLevel;
  }

  error(...args: any[]): void {
    this.log(LogLevel.error, args);
  }

  warn(...args: any[]): void {
    this.log(LogLevel.warn, args);
  }

  info(...args: any[]): void {
    this.log(LogLevel.info, args);
  }

  debug(...args: any[]): void {
    this.log(LogLevel.debug, args);
  }

  trace(...args: any[]): void {
    this.log(LogLevel.trace, args);
  }

  child(...args: any[]): Logger {
    return new SimpleLogger(...this.instanceTags, ...args);
  }

  private log(level: LogLevel, args: any[]): void {
    if (this.consoleLevel >= level) {
      this.sendLogToConsole(level, ...this.instanceTags.concat(args));
    }
    if (this.serverLevel >= level) {
      this.sendLogToServer(level, ...this.instanceTags.concat(args));
    }
  }

  private sendLogToConsole(level: LogLevel, ...args: any[]): void {
    const consoleFunctionName = LogLevel[level] as Exclude<keyof typeof LogLevel, 'silent'>;
    // To prevent failure on old browsers
    if (console[consoleFunctionName]) {
      console[consoleFunctionName](...args);
    } else {
      console.log(...args);
    }
  }

  private sendLogToServer(level: LogLevel, ...args: any[]): void {
    console.log(LogLevel[level], 'sending to server...', ...args);
  }
}
