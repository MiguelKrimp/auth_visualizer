import { Request, Response } from "express";
import { User, userRepository } from "../../database/entities/User";
import { Authenticator } from "./Authenticator";
import { JWTAudience, JWTService } from "../../services/JWTService";

export class JWTAuthenticator extends Authenticator {
  handlesAuthentication(req: Request): boolean {
    const authHeader = req.headers["authorization"];

    return !!authHeader && authHeader.startsWith("Bearer ");
  }

  async authenticate(req: Request, res: Response): Promise<User> {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.substring(7);

    if (!token) {
      throw new Error("No token provided");
    }

    try {
      const payload = JWTService.verifyToken(token);
      if (!payload.sub || payload.aud !== JWTAudience.Login) {
        throw new Error("Invalid token");
      }

      const user = await userRepository().findOne({
        where: { username: payload.sub },
      });
      if (!user) {
        throw new Error("Invalid token");
      }
      return user;
    } catch (err) {
      throw new Error("Invalid or expired token");
    }
  }

  getAuthenticateHeader(): string {
    return "Bearer";
  }
}
