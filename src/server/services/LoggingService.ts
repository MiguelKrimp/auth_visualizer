/* eslint-disable no-console */
export class LoggingService {
  private static logInternal(level: 'log' | 'info' | 'warn' | 'error', ...data: any[]): void {
    console[level](...data);
    // if (data instanceof Error) {
    //   console[level](msg, data.stack || data);
    // } else if (data) {
    //   console[level](msg, data);
    // } else {
    //   console[level](msg);
    // }
  }

  static log(...data: any[]): void {
    this.logInternal('log', ...data);
  }

  static info(...data: any[]): void {
    this.logInternal('info', ...data);
  }

  static warn(...data: any[]): void {
    this.logInternal('warn', ...data);
  }

  static error(...data: any[]): void {
    this.logInternal('error', ...data);
  }
}
