import { DataSource as ORMDatasource } from 'typeorm';

import { EnvironmentVars } from '../Environment';
import { User } from './entities/User';

const DataSource = new ORMDatasource({
  type: 'postgres',
  host: EnvironmentVars.dbHost,
  port: EnvironmentVars.dbPort,
  username: EnvironmentVars.dbUsername,
  password: EnvironmentVars.dbPassword,
  database: 'auth_vis',
  synchronize: EnvironmentVars.development,
  dropSchema: EnvironmentVars.development,
  schema: EnvironmentVars.dbUsername,
  entities: [User],
});

export default DataSource;
