import winston, { createLogger, format, transports } from 'winston';
import nrWinstonEnricher from '@newrelic/winston-enricher';
import omit from 'lodash/omit';

import { config } from './config';
import { AlertError } from './errors';

const newRelicFormatter = nrWinstonEnricher(winston);

const newRelicOptions = {
  host: 'log-api.newrelic.com',
  path: '/log/v1',
  headers: {
    'Api-Key': `${config.newRelicLicenseKey}`,
  },
  ssl: true,
  level: config.logLevel || 'debug',
  format: format.combine(newRelicFormatter(), format.json()),
};

// Only adding the timestamp if running locally. Otherwise the timestamp is little redundant when can be added in supplementary fashion outside of the message itself.
const consoleFormat =
  config.NODE_ENV === 'local'
    ? format.combine(
        format.colorize(),
        format.timestamp({
          format: 'mm:ss.SSS',
        }),
        format.printf((info) => {
          return `${info.timestamp} ${info.level}: ${info.message}`;
        })
      )
    : format.combine(
        format.printf((info) => {
          return `${info.level}: ${info.message}`;
        })
      );

// prevent reporting anywhere but to stdout if running locally
// Note using NPM default log levels: https://github.com/winstonjs/winston#logging-levels
const logTransports =
  config.NODE_ENV === 'local' || config.NODE_ENV === 'test'
    ? [
        new transports.Console({
          level: config.logLevel || 'debug',
          format: consoleFormat,
        }),
        new transports.Http(newRelicOptions),
      ]
    : [
        new transports.Console({
          level: config.logLevel || 'debug',
          format: consoleFormat,
        }),
        new transports.Http(newRelicOptions),
      ];

// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
export const logger = createLogger({
  format: format.combine(format.splat(), format.errors({ stack: true })),
  transports: logTransports,
  silent: config.NODE_ENV === 'test',
});

/**
 * logs that a thrown error has been caught
 * @param {string} caughtBy name of the method/function that caught the error
 * @param {string} thrownBy name of the method/function that threw the error
 * @param {unknown} error the thrown error
 * @returns {void}
 */
export const logCaughtError = (
  caughtBy: string,
  thrownBy: string,
  error: unknown
): void => {
  const meta = typeof error === 'object' ? omit(error, 'hook', 'ctx') : error;
  const alertPrefix = error instanceof AlertError ? '[[ALERT]] ' : '';
  logger.error(
    `${alertPrefix}${caughtBy} caught an error thrown by ${thrownBy}. Error: ${JSON.stringify(
      meta
    )}.`,
    error
  );
};
