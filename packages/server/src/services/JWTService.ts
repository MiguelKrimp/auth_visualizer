import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';

import { EnvironmentVars } from '../Environment';

export class JWTService {
  static createToken(payload: JwtPayload): string {
    return jwt.sign(payload, EnvironmentVars.jwtSecret, {
      algorithm: 'HS256',
      issuer: 'auth-visualizer',
    });
  }

  static verifyToken(token: string): JwtPayload {
    const payload = jwt.verify(token, EnvironmentVars.jwtSecret, {
      algorithms: ['HS256'],
      issuer: 'auth-visualizer',
      complete: false,
    });
    return typeof payload === 'string' ? JSON.parse(payload) : payload;
  }

  static decodeToken(token: string): Jwt | null {
    return jwt.decode(token, { complete: true });
  }
}

export enum JWTAudience {
  Login = 'auth-visualizer-login',
}
