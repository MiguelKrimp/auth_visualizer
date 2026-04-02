import { Express } from 'express';

import { LoggingService } from '../services/LoggingService';
import { AuthenticationMiddleware } from './middleware/AuthenticationMiddleware';
import { JWTLoginResource } from './ressources/authentication/JWTLoginResource';
import { SuperCuteDocuments } from './ressources/documents/SuperCuteDocuments';
import { SecuredResource } from './ressources/SecuredResource';

export function registerResources(app: Express): void {
  const resources: SecuredResource[] = [new JWTLoginResource(), new SuperCuteDocuments()];

  resources.forEach((r) => register(app, r));
}

function register(app: Express, resource: SecuredResource): void {
  const path = resource.getPath();

  const authMiddleware = new AuthenticationMiddleware(resource.getAuthenticators());
  app.use(path, authMiddleware.handle.bind(authMiddleware));
  resource.bind(app);
  LoggingService.info(`Registered resource at path ${path}`);
}
