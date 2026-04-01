import fs from "fs";
import { Express } from "express";
import { AuthenticationMiddleware } from "../../middleware/AuthenticationMiddleware";
import { SecuredResource } from "../SecuredResource";
import { BasicAuthenticator } from "../../middleware/BasicAuthenticator";
import { Authenticator } from "../../middleware/Authenticator";

export class SuperCuteDocuments extends SecuredResource {
  getPath(): string {
    return "/super-cute-documents";
  }

  getAuthenticatingMiddleware(): Authenticator[] {
    return [new BasicAuthenticator()];
  }

  bind(app: Express): void {
    app.get(this.getPath(), (req, res) => {
      const catHtml = fs.readFileSync(
        "src/server/api/ressources/documents/cat.html",
        "utf-8",
      );
      res.status(200).send(catHtml);
    });
  }
}
