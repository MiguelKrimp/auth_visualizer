import { LessThanOrEqual } from 'typeorm';

import { Role } from '../../database/entities/Role';
import { userRepository } from '../../database/entities/User';
import { LoggingService } from '../LoggingService';

const Logger = LoggingService.withName('UserCleanupJob');

export class UserCleanup {
  readonly id: string = 'user-cleanup';
  readonly cronExpression: string = '*/5 * * * *';

  private static USER_TTL: number = 24 * 60 * 60 * 1000;

  async execute(): Promise<void> {
    const result = await userRepository().delete({
      createdAt: LessThanOrEqual(new Date(Date.now() - UserCleanup.USER_TTL)),
      role: Role.TempUser,
    });
    if (result.affected !== undefined) {
      Logger.info(`User cleanup job executed. Deleted ${result.affected} temporary users.`);
    }
  }
}
