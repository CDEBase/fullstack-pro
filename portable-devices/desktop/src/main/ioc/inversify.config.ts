import { AsyncContainerModule, Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import type { Repository } from 'typeorm';
import { User } from '../models';
import { getDBConnection, getRepository } from '../utils';
import TYPES from './types';

import './loader';
// container
const container = new Container();

container.load(buildProviderModule());

export default container;

/**
 * Load asynchronous objects
 */
export const asyncBindings = new AsyncContainerModule(async (bind) => {
    await getDBConnection();

    bind<Repository<User>>(TYPES.UserRepository)
        .toDynamicValue(() => getRepository(User))
        .inRequestScope();
});
