import { Express } from 'express';

import { LoggingService } from '../services/LoggingService';
import { AuthenticationMiddleware } from './middleware/auth/AuthenticationMiddleware';
import { SuperCuteDocuments } from './ressources/documents/cuties/SuperCuteDocuments';
import { JWTLoginResource } from './ressources/login/jwt/JWTLoginResource';
import { SecuredResource } from './ressources/SecuredResource';
import { UserResource } from './ressources/users/UserResource';

export function registerResources(app: Express): void {
  const resources: SecuredResource[] = [
    new JWTLoginResource(),
    new SuperCuteDocuments(),
    new UserResource(),
  ];

  resources.forEach((r) => register(app, r));
}

function register(app: Express, resource: SecuredResource): void {
  const path = resource.getPath();

  const authMiddleware = new AuthenticationMiddleware(resource.getAuthenticators());
  app.use(path, authMiddleware.handle.bind(authMiddleware));
  resource.bind(app);
  LoggingService.instance.info(`Registered resource at path ${path}`);
}
