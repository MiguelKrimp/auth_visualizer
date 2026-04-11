import { NextFunction, Request, Response } from 'express';

import { LoggingService } from '../../../services/LoggingService';

export const RequestLogger = LoggingService.withName('RequestLogger');

function logError(error: Error, req: Request, res: Response, next: NextFunction): void {
  RequestLogger.error(error, `Error in request ${req.method} ${req.path}`);
  next(error);
}

export { logError as ErrorLoggingMiddleware };
