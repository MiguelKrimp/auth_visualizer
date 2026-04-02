import { LoggingService } from '@server/services/LoggingService';
import { NextFunction, Request, Response } from 'express';

function logError(error: Error, req: Request, res: Response, next: NextFunction): void {
  LoggingService.instance.error(
    `Error in request ${req.method} ${req.path}: ${error.message}`,
    error,
  );
  next(error);
}

export { logError as ErrorLoggingMiddleware };
