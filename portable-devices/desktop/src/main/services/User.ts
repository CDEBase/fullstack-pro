/* eslint-disable no-use-before-define */
import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import { Repository } from 'typeorm';

import { User } from '../models';
import TYPES from '../ioc/types';

@provide(UserService)
export class UserService {
    @inject(TYPES.UserRepository) private model!: Repository<User>;

    /**
     * Create an object
     * @param name
     * @param surname
     */
    public insert(name: string, surname: string): Promise<User> {
        return this.model.save({ name, surname });
    }

    public async finAll(): Promise<User[]> {
        return this.model.find();
    }
}
