// spell-checker:ignore printf datadog datadogloglevel ddsource ddtags datadogapikey
import * as winston from 'winston';
const { combine, timestamp, colorize } = winston.format;
import { consoleFormat } from 'winston-console-format';
import { nanoIdForCorrelationIds } from '../nano/nano';
import { serviceAndFunctionNameFormatter } from './consoleLogFormatter';

type LoggerLevelToShow = 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';

/**
 * Provides settings for test loggers
 * showLogMessages {boolean} = suppresses all log messages (default false)
 * showMetadata {boolean} = shows all the metadata with a log message (default false)
 * level {LoggerLevelToShow} = the minimum message logger level to show (default debug)
 *
 * Note that if showMetadata is true then this will force the display of messages to occur
 */
interface TestLoggerSettings {
  showLogMessages?: boolean;
  showMetadata?: boolean;
  level?: LoggerLevelToShow;
  showCid?: boolean;
  showFunctionNames?: boolean;
}

/**
 * Creates a logger for unit tests. By default the logger will suppress
 * all logging messages but it can be configured through settings to
 * show messages, metadata and the logger level to show.
 * @param {TestLoggerSettings} settings  Settings for test logging, if not specified defaults will be used
 * @return {winston.Logger}
 */
export function createTestLogger(settings?: TestLoggerSettings): {
  testLogger: winston.Logger;
  correlationId: string;
} {
  // Set defaults if it the values are not passed in
  let showMessages = settings?.showLogMessages ?? false;
  const showMeta = settings?.showMetadata ?? false;
  const loggerLevelToShow: LoggerLevelToShow = settings?.level ?? 'debug';
  const showCid = settings?.showCid ?? false;
  const showFunctionNames = settings?.showFunctionNames ?? false;

  // Show messages can be overridden if showMetadata is true, or a level has been explicity defined
  if (showMeta || settings?.level || settings?.showCid || settings?.showFunctionNames) {
    showMessages = true;
  }

  const consoleOptions = {
    level: loggerLevelToShow,
    handleExceptions: true,
    format: combine(
      serviceAndFunctionNameFormatter({
        prependMessages: showFunctionNames,
        showCorrelation: showCid,
      }),
      colorize({ colors: { debug: 'yellow' } }),
      timestamp({ format: 'YY-MM-DD HH:MM:ss' }),
      consoleFormat({
        showMeta,
        inspectOptions: {
          depth: Infinity,
          colors: true,
          maxArrayLength: Infinity,
          breakLength: 120,
        },
      }),
    ),
  };

  const correlationId = nanoIdForCorrelationIds();

  const testLogger = winston.createLogger({
    transports: new winston.transports.Console(consoleOptions),
    silent: showMessages === false,
    defaultMeta: {
      cId: correlationId,
    },
  });

  return { testLogger, correlationId };
}
