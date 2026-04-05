import { NextFunction, Request, Response } from 'express';

import { Role } from '../../../database/entities/Role';

export function assertAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.principal) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.principal.role !== Role.Admin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  next();
}
