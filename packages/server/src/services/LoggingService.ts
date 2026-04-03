/* eslint-disable no-console */
export class LoggingService {
  static instance = new LoggingService();

  private constructor() {}

  private logInternal(level: 'log' | 'info' | 'warn' | 'error', ...data: any[]): void {
    console[level](...data);
    // if (data instanceof Error) {
    //   console[level](msg, data.stack || data);
    // } else if (data) {
    //   console[level](msg, data);
    // } else {
    //   console[level](msg);
    // }
  }

  log(...data: any[]): void {
    this.logInternal('log', ...data);
  }

  info(...data: any[]): void {
    this.logInternal('info', ...data);
  }

  warn(...data: any[]): void {
    this.logInternal('warn', ...data);
  }

  error(...data: any[]): void {
    this.logInternal('error', ...data);
  }
}
