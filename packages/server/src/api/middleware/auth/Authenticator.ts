import { ValidAuthSteps } from '@auth-visualizer/common/authflow/steps/AuthSteps';
import { Request, Response } from 'express';

import { User } from '../../../database/entities/User';
import { ISpySession } from '../../spySession/SpySession';

declare global {
  namespace Express {
    interface Request {
      principal?: User;
    }
  }
}

export abstract class Authenticator<T extends ValidAuthSteps = ValidAuthSteps> {
  abstract handlesAuthentication(req: Request): boolean;

  abstract authenticate(req: Request, res: Response, spy: ISpySession<T>): Promise<User>;

  abstract getAuthenticateHeader(): string;
}
