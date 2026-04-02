import { Column, Entity, PrimaryColumn } from 'typeorm';

import DataSource from '../DataSource';
import { Role } from './Role';

@Entity()
export class User {
  @PrimaryColumn()
  username!: string;

  @Column()
  passwordHash!: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP()' })
  createdAt!: Date;

  @Column({ type: 'enum', enum: Role, default: Role.TempUser })
  role!: Role;
}

export function userRepository() {
  return DataSource.getRepository(User);
}
