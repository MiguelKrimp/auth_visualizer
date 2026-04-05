import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import DataSource from '../DataSource';

@Entity()
export class CatPics {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  dataUrl!: string;
}

export function catPicsRepository() {
  return DataSource.getRepository(CatPics);
}
