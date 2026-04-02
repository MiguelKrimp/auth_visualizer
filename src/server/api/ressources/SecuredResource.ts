import { Express } from 'express';

import { Authenticator } from '../middleware/auth/Authenticator';

export abstract class SecuredResource {
  abstract getPath(): string;
  abstract getAuthenticators(): Authenticator[];
  abstract bind(app: Express): void;
}
