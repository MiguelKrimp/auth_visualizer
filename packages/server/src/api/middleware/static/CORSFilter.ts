import { SPY_SESSION_HEADER } from '@auth-visualizer/common';
import { NextFunction, Request, Response } from 'express';

export function CORSFilter(req: Request, res: Response, next: NextFunction): void {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', `Content-Type, Authorization, ${SPY_SESSION_HEADER}`);

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
  } else {
    next();
  }
}
