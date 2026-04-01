import { Express } from "express";
import { SecuredResource } from "./ressources/SecuredResource";
import { SuperCuteDocuments } from "./ressources/documents/SuperCuteDocuments";
import { AuthenticationMiddleware } from "./middleware/AuthenticationMiddleware";
import { JWTLoginResource } from "./ressources/authentication/JWTLoginResource";
import { LoggingService } from "../services/LoggingService";

export function registerResources(app: Express): void {
  const resources: SecuredResource[] = [
    new JWTLoginResource(),
    new SuperCuteDocuments(),
  ];

  resources.forEach((r) => register(app, r));
}

function register(app: Express, resource: SecuredResource): void {
  const path = resource.getPath();

  const authMiddleware = new AuthenticationMiddleware(
    resource.getAuthenticatingMiddleware(),
  );
  app.use(path, authMiddleware.handle.bind(authMiddleware));
  resource.bind(app);
  LoggingService.info(`Registered resource at path ${path}`);
}
