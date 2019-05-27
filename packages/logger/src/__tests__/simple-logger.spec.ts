// tslint:disable:no-console
import { Logger, LogLevel, SimpleLogger } from '../index';

const defaultLoggerConsoleLevel = LogLevel.warn;
const defaultLoggerServerLevel = LogLevel.error;
let logger: Logger;
const defaultLoggerArgs = ['[TestLogger]', 'another default arg'];
const testArgs = ['test arg1', 'test arg2'];
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'info').mockImplementation(() => {});
jest.spyOn(console, 'debug').mockImplementation(() => {});
jest.spyOn(console, 'trace').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});

beforeEach(() => {
  jest.resetAllMocks();
  logger = new SimpleLogger(...defaultLoggerArgs);
  logger.consoleLevel = defaultLoggerConsoleLevel;
  logger.serverLevel = defaultLoggerServerLevel;
});

it('calls only console.warn and console.error with default level', () => {
  logger.error(...testArgs);
  logger.warn(...testArgs);
  logger.info(...testArgs);
  logger.debug(...testArgs);
  logger.trace(...testArgs);

  expect(console.error).toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
  expect(console.warn).toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
  expect(console.info).not.toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
  expect(console.debug).not.toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
  expect(console.trace).not.toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
});

it('calls only console.error with level error', () => {
  logger.consoleLevel = LogLevel.error;

  logger.error(...testArgs);
  logger.warn(...testArgs);
  logger.info(...testArgs);
  logger.debug(...testArgs);
  logger.trace(...testArgs);

  expect(console.error).toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
  expect(console.warn).not.toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
  expect(console.info).not.toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
  expect(console.debug).not.toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
  expect(console.trace).not.toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
});

it('calls only console.warn and console.error with level warn', () => {
  logger.consoleLevel = LogLevel.warn;

  logger.error(...testArgs);
  logger.warn(...testArgs);
  logger.info(...testArgs);
  logger.debug(...testArgs);
  logger.trace(...testArgs);

  expect(console.error).toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
  expect(console.warn).toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
  expect(console.info).not.toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
  expect(console.debug).not.toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
  expect(console.trace).not.toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
});

it('calls only console.info, console.warn and console.error with level info', () => {
  logger.consoleLevel = LogLevel.info;

  logger.error(...testArgs);
  logger.warn(...testArgs);
  logger.info(...testArgs);
  logger.debug(...testArgs);
  logger.trace(...testArgs);

  expect(console.error).toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
  expect(console.warn).toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
  expect(console.info).toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
  expect(console.debug).not.toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
  expect(console.trace).not.toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
});

it('calls only console.debug, console.info, console.warn and console.error with level debug', () => {
  logger.consoleLevel = LogLevel.debug;

  logger.error(...testArgs);
  logger.warn(...testArgs);
  logger.info(...testArgs);
  logger.debug(...testArgs);
  logger.trace(...testArgs);

  expect(console.error).toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
  expect(console.warn).toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
  expect(console.info).toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
  expect(console.debug).toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
  expect(console.trace).not.toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
});

it('calls all console functions with level trace', () => {
  logger.consoleLevel = LogLevel.trace;

  logger.error(...testArgs);
  logger.warn(...testArgs);
  logger.info(...testArgs);
  logger.debug(...testArgs);
  logger.trace(...testArgs);

  expect(console.error).toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
  expect(console.warn).toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
  expect(console.info).toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
  expect(console.debug).toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
  expect(console.trace).toHaveBeenCalledWith(...defaultLoggerArgs, ...testArgs);
});

it('sends to server only error logs', () => {
  logger.error(...testArgs);
  logger.warn(...testArgs);
  logger.info(...testArgs);
  logger.debug(...testArgs);
  logger.trace(...testArgs);

  expect(console.log).toHaveBeenCalledWith('error', 'sending to server...', ...defaultLoggerArgs, ...testArgs);
  expect(console.log).toHaveBeenCalledTimes(1);
});

it('sends to server only levels warn and error if serverLog is warn', () => {
  logger.serverLevel = LogLevel.warn;

  logger.error(...testArgs);
  logger.warn(...testArgs);
  logger.info(...testArgs);
  logger.debug(...testArgs);
  logger.trace(...testArgs);

  expect(console.log).toHaveBeenCalledWith('error', 'sending to server...', ...defaultLoggerArgs, ...testArgs);
  expect(console.log).toHaveBeenCalledWith('warn', 'sending to server...', ...defaultLoggerArgs, ...testArgs);
  expect(console.log).toHaveBeenCalledTimes(2);
});

it('allows to create a child logger with its own args', () => {
  logger.serverLevel = LogLevel.error;
  const childArgs = ['[Child test arg]', 'another test arg'];
  const childLogger = logger.child(...childArgs);

  childLogger.error(...testArgs);

  expect(console.error).toHaveBeenCalledWith(...defaultLoggerArgs, ...childArgs, ...testArgs);
});

it('uses same level for all loggers', () => {
  const childArgs = ['[Child test arg]', 'another test arg'];
  const childLogger = logger.child(...childArgs);
  const newLogger = new SimpleLogger('My Logger');
  logger.consoleLevel = LogLevel.info;

  childLogger.info(...testArgs);
  newLogger.info('VueJS rules!');

  expect(console.info).toHaveBeenCalledWith(...defaultLoggerArgs, ...childArgs, ...testArgs);
  expect(console.info).toHaveBeenCalledWith('My Logger', 'VueJS rules!');
});
