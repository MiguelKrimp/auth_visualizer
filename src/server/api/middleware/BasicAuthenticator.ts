import { NextFunction, Response, Request } from "express";
import { AuthenticationMiddleware } from "./AuthenticationMiddleware";
import { User, userRepository } from "../../database/entities/User";
import { PasswordService } from "../../services/PasswordService";
import { Authenticator } from "./Authenticator";

export class BasicAuthenticator extends Authenticator {
  handlesAuthentication(req: Request): boolean {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return false;
    }

    const [scheme] = authHeader.split(" ");
    if (scheme !== "Basic") {
      return false;
    }
    return true;
  }

  async authenticate(req: Request, res: Response): Promise<User> {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    const [scheme, credentials] = authHeader.split(" ");
    if (scheme !== "Basic" || !credentials) {
      throw new Error("Invalid Authorization header format");
    }

    const decodedCredentials = Buffer.from(credentials, "base64").toString(
      "utf-8",
    );
    const [username, password] = decodedCredentials.split(":");
    if (!username || !password) {
      throw new Error("Invalid Authorization header format");
    }

    const user = await userRepository().findOne({ where: { username } });

    if (!user || !PasswordService.verifyPassword(password, user.passwordHash)) {
      throw new Error("Invalid username or password");
    }

    return user;
  }

  getAuthenticateHeader(): string {
    return 'Basic realm="Secure Area"';
  }
}
