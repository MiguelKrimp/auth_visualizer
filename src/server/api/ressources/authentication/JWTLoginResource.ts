import { Express } from "express";
import { Authenticator } from "../../middleware/Authenticator";
import { SecuredResource } from "../SecuredResource";
import { BasicAuthenticator } from "../../middleware/BasicAuthenticator";
import { JWTAuthenticator } from "../../middleware/JWTAuthenticator";
import { JwtPayload } from "jsonwebtoken";
import { JWTAudience, JWTService } from "../../../services/JWTService";

export class JWTLoginResource extends SecuredResource {
  getPath(): string {
    return "/login/jwt";
  }

  getAuthenticatingMiddleware(): Authenticator[] {
    return [new BasicAuthenticator()];
  }

  bind(app: Express): void {
    app.post(this.getPath(), async (req, res) => {
      const user = req.principal;
      if (!user) {
        res.status(500).send("User not found in request context");
        return;
      }

      const claims: JwtPayload = {
        sub: user.username,
        aud: JWTAudience.Login,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 5 * 60,
      };

      const token = JWTService.createToken(claims);
      res
        .status(200)
        .appendHeader("Cache-Control", "no-store")
        .appendHeader("Pragma", "no-cache")
        .send(token);
    });
  }
}
