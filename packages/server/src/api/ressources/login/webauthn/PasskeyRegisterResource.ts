import { PasskeyRegisterSteps } from '@auth-visualizer/common/authflow/steps/resources/PasskeyRegisterSteps';
import { RegistrationResponseJSON } from '@simplewebauthn/server';
import { Express } from 'express';

import { Role } from '../../../../database/entities/Role';
import { userRepository } from '../../../../database/entities/User';
import { JWTAge, JWTAudience, JWTService } from '../../../../services/JWTService';
import { PasskeyService } from '../../../../services/PasskeyService';
import { Authenticator } from '../../../middleware/authentication/Authenticator';
import { InteractiveResource } from '../../InteractiveResource';

export class PasskeyRegisterResource extends InteractiveResource<PasskeyRegisterSteps> {
  getPath(): string {
    return '/login/webauthn/register';
  }

  getAuthenticators(): Authenticator[] {
    return [];
  }

  bind(app: Express): void {
    app.get(
      this.getPath(),
      this.injectSpySession(async (req, res) => {
        const username = req.query.username as string;

        if (!username) {
          res.status(400).json({ error: 'Username is required' });
          return;
        }

        const registrationOptions =
          await PasskeyService.getInstance().createRegistrationOptions(username);

        const token = JWTService.createToken(
          {
            sub: username,
            aud: JWTAudience.PasskeyRegistration,
            challenge: registrationOptions.challenge,
          },
          JWTAge.Short,
        );

        res.json({ options: registrationOptions, token });
      }),
    );

    app.post(
      this.getPath(),
      this.injectSpySession(async (req, res) => {
        const { token } = req.body;
        const registrationResponse = req.body.response as RegistrationResponseJSON;

        if (!token || !registrationResponse) {
          res.status(400).json({ error: 'Token and registration response are required' });
          return;
        }

        const decodedToken = JWTService.verifyToken(token, JWTAge.Short);
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

        if (!registrationResult.verified) {
          res.status(400).json({ error: 'Registration verification failed' });
          return;
        }

        const user = userRepository().create({
          username: decodedToken.sub,
          role: Role.TempUser,
          authenticators: [
            {
              id: registrationResult.registrationInfo.credential.id,
              publicKey: registrationResult.registrationInfo.credential.publicKey,
              counter: registrationResult.registrationInfo.credential.counter,
            },
          ],
        });
        await userRepository().save(user);

        const loginToken = JWTService.createLoginToken(user.username);
        res
          .status(200)
          .setHeader('Cache-Control', 'no-store')
          .setHeader('Pragma', 'no-cache')
          .send(loginToken);
      }),
    );
  }
}
