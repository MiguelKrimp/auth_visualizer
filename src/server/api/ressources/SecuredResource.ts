import { Express } from "express";
import { AuthenticationMiddleware } from "../middleware/AuthenticationMiddleware";
import { Authenticator } from "../middleware/Authenticator";

export abstract class SecuredResource {
  abstract getPath(): string;
  abstract getAuthenticatingMiddleware(): Authenticator[];
  abstract bind(app: Express): void;
}
