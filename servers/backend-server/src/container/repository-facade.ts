import { Container } from 'inversify';

import { DbConfig } from '@sample/server-core';
import { RepositoryDiSetup } from '@sample/schema';


import { database as DEFAULT_DB_CONFIG } from '../../../../app.json';

const dbConfig = new DbConfig(DEFAULT_DB_CONFIG);
let container = new Container();

container.bind<DbConfig>('DefaultDbConfig').toConstantValue(dbConfig);

// container...
new RepositoryDiSetup().setup(container);

export { container };
