import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';

import { EnvironmentVars } from '../Environment';

export class JWTService {
  static createLoginClaims(username: string): JwtPayload {
    const payload: JwtPayload = {
      sub: username,
      aud: JWTAudience.Login,
    };

    return payload;
  }

  static createToken(payload: JwtPayload, expiresIn: JWTAge): string {
    return jwt.sign(payload, EnvironmentVars.jwtSecret, {
      algorithm: 'HS256',
      issuer: 'auth-visualizer',
      expiresIn,
    });
  }

  static verifyToken(token: string, expiresIn: JWTAge): JwtPayload {
    const payload = jwt.verify(token, EnvironmentVars.jwtSecret, {
      algorithms: ['HS256'],
      issuer: 'auth-visualizer',
      complete: false,
      maxAge: expiresIn,
    });
    return typeof payload === 'string' ? JSON.parse(payload) : payload;
  }

  static decodeToken(token: string): Jwt | null {
    return jwt.decode(token, { complete: true });
  }
}

export enum JWTAge {
  Short = '5m', // 5 minutes
}

export enum JWTAudience {
  Login = 'auth-visualizer-login',
  PasskeyRegistration = 'auth-visualizer-passkey-registration',
  PasskeyAuthentication = 'auth-visualizer-passkey-authentication',
}
