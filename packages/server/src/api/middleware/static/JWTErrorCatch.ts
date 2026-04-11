import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';

/**
 * catches JWT errors which would normally be send back as 500 and instead sends a 401 as this usually indicates failed authentication in some way
 */
function catchJWTError(error: Error, req: Request, res: Response, next: NextFunction): void {
  if (error instanceof JsonWebTokenError) {
    res.status(401).json({ error: 'Invalid or expired token' });
  } else {
    next(error);
  }
}

export { catchJWTError as JWTErrorCatchMiddleware };
