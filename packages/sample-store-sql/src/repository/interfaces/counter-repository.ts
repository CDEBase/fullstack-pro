import { IRepository } from '../../db-helpers';
import { ICount } from '../../models';

export interface ICounterRepository extends IRepository<ICount> {

    getCount: () => Promise<ICount>;

    addCount: (int) => void;
}
