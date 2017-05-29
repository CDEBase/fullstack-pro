import { Container } from 'inversify';

import { DbConfig } from '@sample/server-core';
import { RepositoryDiSetup } from '@sample/schema';


const DEFAULT_DB_CONFIG = require('../../db-config.json');


const dbConfig = new DbConfig(DEFAULT_DB_CONFIG);
let container = new Container();

container.bind<DbConfig>('DefaultDbConfig').toConstantValue(dbConfig);

// container...
new RepositoryDiSetup().setup(container);

export { container };