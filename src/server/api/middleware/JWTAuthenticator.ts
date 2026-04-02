import { JWTAuthSteps } from '@common/authflow/steps/authenticators/JwtAuthSteps';
import { Request, Response } from 'express';

import { User, userRepository } from '../../database/entities/User';
import { JWTAudience, JWTService } from '../../services/JWTService';
import { ISpySession } from '../spySession/SpySession';
import { Authenticator } from './Authenticator';

export class JWTAuthenticator extends Authenticator<JWTAuthSteps> {
  handlesAuthentication(req: Request): boolean {
    const authHeader = req.headers['authorization'];

    return !!authHeader && authHeader.startsWith('Bearer ');
  }

  async authenticate(req: Request, _res: Response, spy: ISpySession<JWTAuthSteps>): Promise<User> {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.substring(7);

    if (!token) {
      throw new Error('No token provided');
    }

    await spy.step('ExtractToken', { token });

    const decoded = JWTService.decodeToken(token);
    await spy.step('DecodeToken', {
      header: decoded?.header,
      payload: decoded?.payload,
      signature: decoded?.signature,
    });

    try {
      const payload = JWTService.verifyToken(token);
      await spy.step('VerifyToken', { payload });

      if (!payload.sub || payload.aud !== JWTAudience.Login) {
        throw new Error('Invalid token');
      }

      const user = await userRepository().findOne({
        where: { username: payload.sub },
      });
      if (!user) {
        throw new Error('Invalid token');
      }
      await spy.step('LookupUser', { username: user.username });

      return user;
      // eslint-disable-next-line unused-imports/no-unused-vars
    } catch (_err) {
      throw new Error('Invalid or expired token');
    }
  }

  getAuthenticateHeader(): string {
    return 'Bearer';
  }
}
