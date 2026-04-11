import { NextFunction, Request, Response } from 'express';

import { RequestLogger } from './ErrorLogging';

function requestLoggingMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startedAt = process.hrtime.bigint();

  res.on('finish', () => {
    if (req.method === 'OPTIONS') {
      return;
    }

    const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    const logPayload = {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      responseTimeMs: Number(elapsedMs.toFixed(2)),
      ip: req.ip,
      userAgent: req.get('user-agent'),
    };

    if (res.statusCode >= 400) {
      RequestLogger.warn(logPayload, 'Request completed with client error');
      return;
    }

    RequestLogger.info(logPayload, 'Request completed');
  });

  next();
}

export { requestLoggingMiddleware as RequestLoggingMiddleware };
