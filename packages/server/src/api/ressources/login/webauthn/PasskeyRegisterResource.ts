import { PasskeyRegisterSteps } from '@auth-visualizer/common/authflow/steps/resources/PasskeyRegisterSteps';
import { RegistrationResponseJSON } from '@simplewebauthn/server';
import { Express } from 'express';

import { authenticatorRepository } from '../../../../database/entities/Authenticator';
import { JWTAge, JWTAudience, JWTService } from '../../../../services/JWTService';
import { PasskeyService } from '../../../../services/PasskeyService';
import { Authenticator } from '../../../middleware/authentication/Authenticator';
import { BasicAuthenticator } from '../../../middleware/authentication/BasicAuthenticator';
import { JWTAuthenticator } from '../../../middleware/authentication/JWTAuthenticator';
import { InteractiveResource } from '../../InteractiveResource';

export class PasskeyRegisterResource extends InteractiveResource<PasskeyRegisterSteps> {
  getPath(): string {
    return '/login/webauthn/register';
  }

  getAuthenticators(): Authenticator[] {
    return [new BasicAuthenticator(), new JWTAuthenticator()];
  }

  bind(app: Express): void {
    app.get(
      this.getPath(),
      this.injectSpySession(async (req, res, spy) => {
        const username = req.principal?.username;

        if (!username) {
          res.status(401).json({ error: 'Unauthorized' });
          return;
        }

        const registrationOptions =
          await PasskeyService.getInstance().createRegistrationOptions(username);

        const claims = {
          sub: username,
          aud: JWTAudience.PasskeyRegistration,
          challenge: registrationOptions.challenge,
        };
        const token = JWTService.createToken(claims, JWTAge.Short);

        await spy.step('CreateRegistrationOptions', {
          options: registrationOptions,
          tokenClaims: claims,
        });

        res.json({ options: registrationOptions, token });
      }),
    );

    app.post(
      this.getPath(),
      this.injectSpySession(async (req, res, spy) => {
        const { token } = req.body;
        const registrationResponse = req.body.response as RegistrationResponseJSON;

        if (!token || !registrationResponse) {
          res.status(400).json({ error: 'Token and registration response are required' });
          return;
        }

        const decodedToken = JWTService.verifyToken(token, JWTAge.Short);
        await spy.step('VerifiedRegisterToken', { tokenClaims: decodedToken });
        if (
          decodedToken.aud !== JWTAudience.PasskeyRegistration ||
          !decodedToken.challenge ||
          !decodedToken.sub
        ) {
          res.status(400).json({ error: 'Invalid token' });
          return;
        }

        const registrationResult = await PasskeyService.getInstance().verifyRegistration(
          decodedToken.challenge,
          registrationResponse,
        );

        await spy.step('VerifyRegisterChallenge', {
          verified: registrationResult.verified,
          verificationResult: registrationResult,
        });

        if (!registrationResult.verified) {
          res.status(400).json({ error: 'Registration verification failed' });
          return;
        }

        const authenticator = authenticatorRepository().create({
          id: registrationResult.registrationInfo.credential.id,
          publicKey: registrationResult.registrationInfo.credential.publicKey,
          counter: registrationResult.registrationInfo.credential.counter,
          user: {
            username: decodedToken.sub,
          },
        });

        await authenticatorRepository().insert(authenticator);

        await spy.step('SaveAuthenticator', {
          userId: decodedToken.sub,
          authenticatorId: registrationResult.registrationInfo.credential.id,
        });

        const loginToken = JWTService.createToken(
          JWTService.createLoginClaims(decodedToken.sub),
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
