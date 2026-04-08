import { Express } from 'express';

import { LoggingService } from '../services/LoggingService';
import { AuthenticationMiddleware } from './middleware/authentication/AuthenticationMiddleware';
import { CatPicResource } from './ressources/documents/catpics/CatPicResource';
import { JWTLoginResource } from './ressources/login/jwt/JWTLoginResource';
import { PasskeyLoginResource } from './ressources/login/webauthn/PasskeyLoginResource';
import { PasskeyRegisterResource } from './ressources/login/webauthn/PasskeyRegisterResource';
import { SecuredResource } from './ressources/SecuredResource';
import { UserResource } from './ressources/users/UserResource';

export function registerResources(app: Express): void {
  const resources: SecuredResource[] = [
    new JWTLoginResource(),
    new PasskeyRegisterResource(),
    new PasskeyLoginResource(),
    new CatPicResource(),
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
