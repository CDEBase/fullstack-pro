import { IRepository } from '../../IRepository';
import { ICount } from './ICountModel';

export interface ICounterRepository extends IRepository<ICount> {
    
    getCount: () => Promise<ICount>;

    addCount: (int) => void;
}