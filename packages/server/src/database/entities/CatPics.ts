import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import DataSource from '../DataSource';

@Entity()
export class CatPics {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('text')
  dataUrl!: string;

  @Column({ default: 'text/plain' })
  mimeType!: string;
}

export function catPicsRepository() {
  return DataSource.getRepository(CatPics);
}
