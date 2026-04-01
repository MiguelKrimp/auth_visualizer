export class LoggingService {
  private static logInternal(
    level: "log" | "info" | "warn" | "error",
    msg: string,
    err?: any,
  ): void {
    if (err) {
      console[level](msg, err.stack || err);
    } else {
      console[level](msg);
    }
  }

  static log(msg: string, err?: any): void {
    this.logInternal("log", msg, err);
  }

  static info(msg: string, err?: any): void {
    this.logInternal("info", msg, err);
  }

  static warn(msg: string, err?: any): void {
    this.logInternal("warn", msg, err);
  }

  static error(msg: string, err?: any): void {
    this.logInternal("error", msg, err);
  }
}
