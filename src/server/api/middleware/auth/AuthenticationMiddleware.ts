import { NextFunction, Request, Response } from 'express';

import { SpySessionBroker } from '../../spySession/SpySessionBroker';
import { Authenticator } from './Authenticator';

export class AuthenticationMiddleware {
  private authenticators: Authenticator[];

  constructor(authenticators: Authenticator[]) {
    this.authenticators = authenticators;
  }

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (this.authenticators.length === 0) {
      next();
      return;
    }

    const handlingAuthenticator = this.authenticators.find((authenticator) =>
      authenticator.handlesAuthentication(req),
    );

    if (!handlingAuthenticator) {
      this.toUnauthorizedResponse(res, 'No suitable authentication method found');
      return;
    }

    try {
      const authenticateWithSpy = SpySessionBroker.getInstance().injectSpySession(
        handlingAuthenticator.authenticate.bind(handlingAuthenticator),
      );

      const principal = await authenticateWithSpy(req, res);
      req.principal = principal;

      next();
      return;
    } catch (err) {
      this.toUnauthorizedResponse(
        res,
        err instanceof Error ? err.message : 'Authentication failed',
      );
    }
  }

  protected toUnauthorizedResponse(res: Response, msg: string): void {
    res.status(401);

    res.setHeader(
      'WWW-Authenticate',
      this.authenticators.map((a) => a.getAuthenticateHeader()).join(', '),
    );
    res.send(msg);
  }
}
