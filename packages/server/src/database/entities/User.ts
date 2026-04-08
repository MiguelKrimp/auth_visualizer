import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import DataSource from '../DataSource';
import { Authenticator } from './Authenticator';
import { Role } from './Role';

@Entity()
export class User {
  @PrimaryColumn()
  username!: string;

  @Column({ nullable: true })
  passwordHash!: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP()' })
  createdAt!: Date;

  @Column({ type: 'enum', enum: Role, default: Role.TempUser })
  role!: Role;

  @OneToMany(() => Authenticator, (authenticator) => authenticator.user, {
    cascade: true,
  })
  authenticators!: Authenticator[];
}

export function userRepository() {
  return DataSource.getRepository(User);
}
