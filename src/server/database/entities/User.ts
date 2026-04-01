import { Column, Entity, PrimaryColumn } from "typeorm";
import DataSource from "../DataSource";

@Entity()
export class User {
  @PrimaryColumn()
  username!: string;

  @Column()
  passwordHash!: string;
}

export function userRepository() {
  return DataSource.getRepository(User);
}
