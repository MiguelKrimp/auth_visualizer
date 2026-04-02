import { Express } from 'express';
import fs from 'fs';

import { Authenticator } from '../../middleware/Authenticator';
import { BasicAuthenticator } from '../../middleware/BasicAuthenticator';
import { JWTAuthenticator } from '../../middleware/JWTAuthenticator';
import { SecuredResource } from '../SecuredResource';

export class SuperCuteDocuments extends SecuredResource {
  getPath(): string {
    return '/super-cute-documents';
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
