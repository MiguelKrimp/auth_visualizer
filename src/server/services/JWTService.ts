import jwt, { JwtPayload } from "jsonwebtoken";
import { EnvironmentVars } from "../Environment";

export class JWTService {
  static createToken(payload: JwtPayload): string {
    return jwt.sign(payload, EnvironmentVars.jwtSecret, {
      algorithm: "HS256",
      issuer: "auth-visualizer",
    });
  }

  static verifyToken(token: string): JwtPayload {
    const payload = jwt.verify(token, EnvironmentVars.jwtSecret, {
      algorithms: ["HS256"],
      issuer: "auth-visualizer",
      complete: false,
    });
    return typeof payload === "string" ? JSON.parse(payload) : payload;
  }
}

export enum JWTAudience {
  Login = "auth-visualizer-login",
}
