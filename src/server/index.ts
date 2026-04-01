import "reflect-metadata";
import DataSource from "./database/DataSource";
import { EnvironmentVars, validateEnvironmentVars } from "./Environment";
import express from "express";

async function main(): Promise<void> {
  validateEnvironmentVars();

  await DataSource.initialize();

  const app = express();

  app.listen(EnvironmentVars.port);
}

main();
