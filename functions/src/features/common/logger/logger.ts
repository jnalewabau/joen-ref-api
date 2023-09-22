// spell-checker:ignore datadog datadogloglevel ddsource ddtags datadogapikey
import * as winston from 'winston';
const { combine, timestamp, colorize } = winston.format;
import { consoleFormat } from 'winston-console-format';
import { format } from 'date-fns';
import { serviceAndFunctionNameFormatter } from './consoleLogFormatter';

import * as dotenv from 'dotenv';
dotenv.config();

const configConsoleLogLevel = process.env.LOGGER_LEVEL || 'info';

// Control whether the service name should be displayed in log messages
const logMessagePrefix = process.env.LOG_MESSAGE_PREFIX ?? '';

// Control whether the metadata should be displayed in log messages
const showMeta = process.env.SHOW_META ? process.env.SHOW_META == 'true' : false;

const options = {
  console: {
    level: configConsoleLogLevel,
    handleExceptions: true,
    format: combine(
      serviceAndFunctionNameFormatter({
        logMessagePrefix,
        showMeta,
      }),
      colorize({ colors: { debug: 'yellow' } }),
      timestamp({ format: 'YY-MM-DD HH:MM:ss' }),
      consoleFormat({
        showMeta,
        // metaStrip: ['timestamp', 'service'],
        inspectOptions: {
          depth: Infinity,
          colors: true,
          maxArrayLength: Infinity,
          breakLength: 120,
        },
      }),
    ),
  },
};

export const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  transports: [new winston.transports.Console(options.console)],
  exitOnError: false, // do not exit on handled exceptions
});

if (process.env.FUNCTIONS_EMULATOR === 'true') {
  // File transport isn't available when running in cloud
  logger.add(
    new winston.transports.File({
      level: 'debug',
      filename: `${format(new Date(), 'd-MMM-yyyy-HH_mm')}-debug.log`,
      dirname: 'winston-logs',
    }),
  );
}

if (process.env.NODE_ENV !== 'test') {
  // Not in test mode so we add transports to our production log aggregator (e.g. Datadog, Sentry)
  //   // Disables the transports when running the tests.
  //   logger.add(
  //     new DatadogWinston({
  //       apiKey: functions.config().apm.datadogapikey,
  //       hostname: 'firebase',
  //       ddsource: 'nodejs',
  //       ddtags: `env:${functions.config().project.name}`,
  //       level: configDataDogLogLevel,
  //       format: combine(timestamp()),
  //     }),
  //   );
}
