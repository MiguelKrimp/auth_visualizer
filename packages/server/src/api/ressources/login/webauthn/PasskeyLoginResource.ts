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
      this.injectSpySession(async (req, res, spy) => {
        const authenticationOptions =
          await PasskeyService.getInstance().createAuthenticationOptions();

        const claims = {
          aud: JWTAudience.PasskeyAuthentication,
          challenge: authenticationOptions.challenge,
        };

        const token = JWTService.createToken(claims, JWTAge.Short);

        await spy.step('CreateAuthenticationOptions', {
          options: authenticationOptions,
          tokenClaims: claims,
        });

        res.json({ options: authenticationOptions, token });
      }),
    );

    app.post(
      this.getPath(),
      this.injectSpySession(async (req, res, spy) => {
        const { token } = req.body;
        const challengeResponse = req.body.response as AuthenticationResponseJSON;

        if (!token || !challengeResponse.response.userHandle) {
          res.status(400).send('Token and challenge response are required');
          return;
        }

        const decodedToken = JWTService.verifyToken(token, JWTAge.Short);
        await spy.step('VerifiedChallengeToken', { tokenClaims: decodedToken });
        if (decodedToken.aud !== JWTAudience.PasskeyAuthentication || !decodedToken.challenge) {
          res.status(400).send('Invalid token');
          return;
        }

        const authenticatorId = challengeResponse.id;
        const username = Buffer.from(challengeResponse.response.userHandle, 'base64').toString(
          'utf-8',
        );
        const authenticator = await authenticatorRepository().findOne({
          where: {
            id: authenticatorId,
            user: {
              username,
            },
          },
          relations: ['user'],
        });

        await spy.step('LookupAuthenticator', {
          lookup: {
            id: authenticatorId,
            username,
          },
          authenticatorFound: !!authenticator,
        });
        if (!authenticator) {
          res.status(400).send('Authentication verification failed');
          return;
        }

        const verificationResult = await PasskeyService.getInstance().verifyAuthentication(
          decodedToken.challenge,
          authenticator.counter,
          authenticator.publicKey,
          authenticator.id,
          challengeResponse,
        );

        await spy.step('VerifyLoginChallenge', {
          verified: verificationResult.verified,
          verificationResult,
        });

        if (!verificationResult.verified) {
          res.status(400).send('Authentication verification failed');
          return;
        }

        authenticator.counter = verificationResult.authenticationInfo.newCounter;
        await authenticatorRepository().save(authenticator);
        await spy.step('UpdateAuthenticatorCounter', {
          newCounter: authenticator.counter,
        });

        const loginToken = JWTService.createToken(
          JWTService.createLoginClaims(authenticator.user.username),
          JWTAge.Short,
        );
        res
          .status(200)
          .setHeader('Cache-Control', 'no-store')
          .setHeader('Pragma', 'no-cache')
          .send(loginToken);
      }),
    );
  }
}
