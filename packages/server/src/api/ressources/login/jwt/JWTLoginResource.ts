import { JwtIssueSteps } from '@auth-visualizer/common/authflow/steps/resources/JwtIssueSteps';
import { Express } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import { JWTAge, JWTAudience, JWTService } from '../../../../services/JWTService';
import { Authenticator } from '../../../middleware/authentication/Authenticator';
import { BasicAuthenticator } from '../../../middleware/authentication/BasicAuthenticator';
import { InteractiveResource } from '../../InteractiveResource';

export class JWTLoginResource extends InteractiveResource<JwtIssueSteps> {
  getPath(): string {
    return '/login/jwt';
  }

  getAuthenticators(): Authenticator[] {
    return [new BasicAuthenticator()];
  }

  bind(app: Express): void {
    app.post(
      this.getPath(),
      this.injectSpySession(async (req, res, spy) => {
        const user = req.principal;
        if (!user) {
          res.status(500).send('User not found in request context');
          return;
        }

        const claims: JwtPayload = {
          sub: user.username,
          aud: JWTAudience.Login,
        };

        await spy.step('BuildClaims', { claims });

        const token = JWTService.createToken(claims, JWTAge.Short);
        await spy.step('CreateToken', { token });

        res
          .status(200)
          .setHeader('Cache-Control', 'no-store')
          .setHeader('Pragma', 'no-cache')
          .send(token);
      }),
    );
  }
}
