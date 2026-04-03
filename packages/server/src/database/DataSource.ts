import { DataSource as ORMDatasource } from 'typeorm';

import { EnvironmentVars } from '../Environment';

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
  entities: [__dirname + '/entities/*'],
});

export default DataSource;
