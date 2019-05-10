export interface Logger {
  consoleLevel: LogLevel;
  serverLevel: LogLevel;
  error: LogFn;
  warn: LogFn;
  info: LogFn;
  debug: LogFn;
  trace: LogFn;
  child: (...args: any[]) => Logger;
}

export type LogFn = (...args: any[]) => void;

export enum LogLevel {
  silent = 0,
  error = 1,
  warn = 2,
  info = 3,
  debug = 4,
  trace = 5
}
