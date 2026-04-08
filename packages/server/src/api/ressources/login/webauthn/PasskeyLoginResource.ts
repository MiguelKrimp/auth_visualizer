import { PasskeyLoginSteps } from '@auth-visualizer/common/authflow/steps/resources/PasskeyLoginSteps';
import { AuthenticationResponseJSON } from '@simplewebauthn/server';
import { Express } from 'express';

import { authenticatorRepository } from '../../../../database/entities/Authenticator';
import { JWTAge, JWTAudience, JWTService } from '../../../../services/JWTService';
import { PasskeyService } from '../../../../services/PasskeyService';
import { Authenticator } from '../../../middleware/authentication/Authenticator';
import { InteractiveResource } from '../../InteractiveResource';

export class PasskeyLoginResource extends InteractiveResource<PasskeyLoginSteps> {
  getPath(): string {
    return '/login/webauthn';
  }

  getAuthenticators(): Authenticator[] {
    return [];
  }

  bind(app: Express): void {
    app.get(
      this.getPath(),
      this.injectSpySession(async (req, res) => {
        const authenticationOptions =
          await PasskeyService.getInstance().createAuthenticationOptions();

        const token = JWTService.createToken(
          {
            aud: JWTAudience.PasskeyAuthentication,
            challenge: authenticationOptions.challenge,
          },
          JWTAge.Short,
        );

        res.json({ options: authenticationOptions, token });
      }),
    );

    app.post(
      this.getPath(),
      this.injectSpySession(async (req, res) => {
        const { token } = req.body;
        const challengeResponse = req.body.response as AuthenticationResponseJSON;

        if (!token || !challengeResponse.response.userHandle) {
          res.status(400).json({ error: 'Token and challenge response are required' });
          return;
        }

        const decodedToken = JWTService.verifyToken(token, JWTAge.Short);
        if (decodedToken.aud !== JWTAudience.PasskeyAuthentication || !decodedToken.challenge) {
          res.status(400).json({ error: 'Invalid token' });
          return;
        }

        const authenticator = await authenticatorRepository().findOne({
          where: {
            id: challengeResponse.id,
            user: {
              username: Buffer.from(challengeResponse.response.userHandle, 'base64').toString(
                'utf-8',
              ),
            },
          },
          relations: ['user'],
        });

        if (!authenticator) {
          res.status(404).json({ error: 'Authenticator not found' });
          return;
        }

        const verificationResult = await PasskeyService.getInstance().verifyAuthentication(
          decodedToken.challenge,
          authenticator.counter,
          authenticator.publicKey,
          authenticator.id,
          challengeResponse,
        );

        if (!verificationResult.verified) {
          res.status(400).json({ error: 'Authentication verification failed' });
          return;
        }

        authenticator.counter = verificationResult.authenticationInfo.newCounter;
        await authenticatorRepository().save(authenticator);

        const loginToken = JWTService.createLoginToken(authenticator.user.username);
        res
          .status(200)
          .setHeader('Cache-Control', 'no-store')
          .setHeader('Pragma', 'no-cache')
          .send(loginToken);
      }),
    );
  }
}
