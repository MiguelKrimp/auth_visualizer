import { Express, Request, Response } from 'express';

import { User, userRepository } from '../../../database/entities/User';
import { LoggingService } from '../../../services/LoggingService';
import { PasswordService } from '../../../services/PasswordService';
import { Authenticator } from '../../middleware/authentication/Authenticator';
import { SecuredResource } from '../SecuredResource';

export class UserResource extends SecuredResource {
  getPath(): string {
    return '/users';
  }

  getAuthenticators(): Authenticator[] {
    return [];
  }

  bind(app: Express): void {
    app.post(this.getPath(), async (req: Request, res: Response) => {
      const { username, password } = req.body;
      if (!username || !password) {
        res.status(400).send('Username and password are required');
        return;
      }

      const existingUser = await userRepository().findOne({ where: { username } });
      if (existingUser) {
        res.status(409).send('Username already exists');
        return;
      }

      const newUser = new User();
      newUser.username = username;
      newUser.passwordHash = PasswordService.hashPassword(password);
      await userRepository().insert(newUser);

      LoggingService.instance.info(`Created new user: ${username}`);

      res.status(201).send('User created');
    });
  }
}
