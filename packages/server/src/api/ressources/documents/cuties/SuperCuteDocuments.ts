import { Express } from 'express';
import fs from 'fs';

import { Authenticator } from '../../../middleware/auth/Authenticator';
import { BasicAuthenticator } from '../../../middleware/auth/BasicAuthenticator';
import { JWTAuthenticator } from '../../../middleware/auth/JWTAuthenticator';
import { SecuredResource } from '../../SecuredResource';

export class SuperCuteDocuments extends SecuredResource {
  getPath(): string {
    return '/documents/cuties';
  }

  getAuthenticators(): Authenticator[] {
    return [new BasicAuthenticator(), new JWTAuthenticator()];
  }

  bind(app: Express): void {
    app.get(this.getPath(), (req, res) => {
      const catHtml = fs.readFileSync('src/server/api/ressources/documents/cat.html', 'utf-8');
      res.status(200).send(catHtml);
    });
  }
}
