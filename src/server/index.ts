import "reflect-metadata";
import DataSource from "./database/DataSource";
import { EnvironmentVars, validateEnvironmentVars } from "./Environment";
import express from "express";
import { userRepository } from "./database/entities/User";
import { registerResources } from "./api/ResourceRegister";
import { PasswordService } from "./services/PasswordService";
import { Role } from "./database/entities/Role";

async function main(): Promise<void> {
  validateEnvironmentVars();

  await DataSource.initialize();

  // Create a demo user if it doesn't exist
  const demoUser = await userRepository().findOne({
    where: { username: EnvironmentVars.demoUsername },
  });
  if (!demoUser) {
    userRepository().insert({
      username: EnvironmentVars.demoUsername,
      passwordHash: PasswordService.hashPassword(EnvironmentVars.demoPassword),
      role: Role.Admin,
    });
  }

  const app = express();
  registerResources(app);
  app.listen(EnvironmentVars.port);
}

main();
