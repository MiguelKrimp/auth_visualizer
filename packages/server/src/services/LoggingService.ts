import path from 'node:path';

import pino, { Logger, LoggerOptions } from 'pino';

import { EnvironmentVars } from '../Environment';

function createLogger(): Logger {
  const loggerOptions: LoggerOptions = {
    level: EnvironmentVars.logLevel,
    base: {
      name: 'Root',
    },
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        'password',
        'passwordHash',
        'token',
        'jwt',
        'body.password',
        'body.passwordHash',
      ],
      censor: '[REDACTED]',
    },
    transport: {
      targets: [
        {
          target: 'pino/file',
          options: {
            destination: path.join(EnvironmentVars.logDirectory, EnvironmentVars.logFileName),
            mkdir: true,
          },
        },
        {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
      ],
    },
  };

  return pino(loggerOptions);
}

export class LoggingService {
  static readonly rootLogger = createLogger();

  static withName(name: string): Logger {
    return LoggingService.rootLogger.child({ name });
  }

  static withBindings(bindings: Record<string, unknown>): Logger {
    return LoggingService.rootLogger.child(bindings);
  }
}
