import 'reflect-metadata';

import express from 'express';

import { CORSFilter } from './api/middleware/static/CORSFilter';
import { ErrorLoggingMiddleware } from './api/middleware/static/ErrorLogging';
import { JSONBodyParser } from './api/middleware/static/JSONBodyParser';
import { registerResources } from './api/ResourceRegister';
import { SpySessionServer } from './api/spySession/SpySessionServer';
import DataSource from './database/DataSource';
import { Role } from './database/entities/Role';
import { userRepository } from './database/entities/User';
import { EnvironmentVars, validateEnvironmentVars } from './Environment';
import { UserCleanup } from './services/jobs/UserCleanup';
import { LoggingService } from './services/LoggingService';
import { PasswordService } from './services/PasswordService';
import { SchedulerService } from './services/SchedulerService';

async function main(): Promise<void> {
  validateEnvironmentVars();

  // db stuff
  await DataSource.initialize();
  LoggingService.instance.info('Database connection established');

  if (EnvironmentVars.development) {
    const demoUser = await userRepository().findOne({
      where: { username: EnvironmentVars.demoUsername },
    });
    if (!demoUser) {
      userRepository().insert({
        username: EnvironmentVars.demoUsername,
        passwordHash: PasswordService.hashPassword(EnvironmentVars.demoPassword),
        role: Role.Admin,
      });
      LoggingService.instance.info(`Demo user '${EnvironmentVars.demoUsername}' created`);
    }
  }

  // api
  const app = express();

  app.use(JSONBodyParser);
  app.use(CORSFilter);

  registerResources(app);

  app.use(ErrorLoggingMiddleware);

  const server = app.listen(EnvironmentVars.port);
  LoggingService.instance.info(`Server started on port ${EnvironmentVars.port}`);

  const spySessionServer = new SpySessionServer(server);
  spySessionServer.initialize();

  // jobs
  const userCleanupJob = new UserCleanup();
  SchedulerService.getInstance().scheduleJob(
    userCleanupJob.id,
    userCleanupJob.cronExpression,
    userCleanupJob.execute,
  );
}

main();
