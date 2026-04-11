import { Express } from 'express';

import { catPicsRepository } from '../../../../database/entities/CatPics';
import { LoggingService } from '../../../../services/LoggingService';
import { Authenticator } from '../../../middleware/authentication/Authenticator';
import { BasicAuthenticator } from '../../../middleware/authentication/BasicAuthenticator';
import { JWTAuthenticator } from '../../../middleware/authentication/JWTAuthenticator';
import { assertAdmin } from '../../../middleware/authorization/assertAdmin';
import { SecuredResource } from '../../SecuredResource';

const Logger = LoggingService.withName('CatPicResource');
export class CatPicResource extends SecuredResource {
  getPath(): string {
    return '/documents/catpics';
  }

  getAuthenticators(): Authenticator[] {
    return [new BasicAuthenticator(), new JWTAuthenticator()];
  }

  bind(app: Express): void {
    app.get(this.getPath(), async (req, res) => {
      const catPic = await catPicsRepository()
        .createQueryBuilder('catPics')
        .orderBy('RANDOM()')
        .getOne();

      if (!catPic) {
        // AI is responsible for the quality of this error message, not me.
        return res.status(404).json({ error: "It's a cat-astrophe! No cat pics found." });
      }

      res.status(200).setHeader('Content-Type', 'text/plain').send(catPic.dataUrl);
    });

    app.post(this.getPath(), assertAdmin, async (req, res) => {
      const { dataUrl, label } = req.body;

      if (!dataUrl) {
        return res.status(400).json({ error: 'Missing dataUrl' });
      }

      const catPic = catPicsRepository().create({ dataUrl, name: label || 'Unnamed cutie' });
      await catPicsRepository().save(catPic);

      Logger.info(`New cat pic added: ${catPic.name}`);

      res.status(201).json(catPic);
    });
  }
}
