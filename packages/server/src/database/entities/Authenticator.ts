import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import DataSource from '../DataSource';
import { User } from './User';

@Entity()
export class Authenticator {
  @PrimaryColumn()
  id!: string;

  @Column({ type: 'bytea' })
  publicKey!: Uint8Array<ArrayBuffer>;

  @Column()
  counter!: number;

  @Column({ default: 'public-key' })
  type!: string;

  @ManyToOne(() => User, (user) => user.authenticators, { onDelete: 'CASCADE' })
  user!: User;
}

export function authenticatorRepository() {
  return DataSource.getRepository(Authenticator);
}
