import { Request, Response } from "express";
import { User } from "../../database/entities/User";

declare global {
  namespace Express {
    interface Request {
      principal?: User;
    }
  }
}

export abstract class Authenticator {
  abstract handlesAuthentication(req: Request): boolean;

  abstract authenticate(req: Request, res: Response): Promise<User>;

  abstract getAuthenticateHeader(): string;
}
