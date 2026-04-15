import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import DataSource from '../DataSource';
import { Authenticator } from './Authenticator';
import { Role } from './Role';

@Entity()
export class User {
  @PrimaryColumn()
  username!: string;

  @Column()
  passwordHash!: string;

  @CreateDateColumn()
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
