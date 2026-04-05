import { BasicAuthSteps } from '@auth-visualizer/common/authflow/steps/authenticators/BasicAuthSteps';
import { Request, Response } from 'express';

import { User, userRepository } from '../../../database/entities/User';
import { PasswordService } from '../../../services/PasswordService';
import { ISpySession } from '../../spySession/SpySession';
import { Authenticator } from './Authenticator';

export class BasicAuthenticator extends Authenticator<BasicAuthSteps> {
  handlesAuthentication(req: Request): boolean {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return false;
    }

    const [scheme] = authHeader.split(' ');
    if (scheme !== 'Basic') {
      return false;
    }
    return true;
  }

  async authenticate(
    req: Request,
    _res: Response,
    spy: ISpySession<BasicAuthSteps>,
  ): Promise<User> {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }

    const [scheme, credentials] = authHeader.split(' ');
    if (scheme !== 'Basic' || !credentials) {
      throw new Error('Invalid Authorization header format');
    }

    const decodedCredentials = Buffer.from(credentials, 'base64').toString('utf-8');
    const [username, password] = decodedCredentials.split(':');
    if (!username || !password) {
      throw new Error('Invalid Authorization header format');
    }

    await spy.step('DecodeBasicHeader', {
      header: authHeader,
      decoded: decodedCredentials,
    });

    const user = await userRepository().findOne({ where: { username } });

    if (!user) {
      throw new Error('Invalid username or password');
    }

    await spy.step('LookupUserPassword', { username, passwordHash: user.passwordHash });

    const passwordValid = PasswordService.verifyPassword(password, user.passwordHash);

    await spy.step('VerifyPassword', {
      sentPassword: password,
      valid: passwordValid,
    });

    if (!passwordValid) {
      throw new Error('Invalid username or password');
    }

    return user;
  }

  getAuthenticateHeader(): string {
    return 'Basic realm="Secure Area"';
  }
}
