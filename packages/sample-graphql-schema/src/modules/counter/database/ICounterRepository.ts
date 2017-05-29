import { IRepository } from '@sample/server-core';
import { ICount } from './ICountModel';

export interface ICounterRepository extends IRepository<ICount> {
    
    getCount: () => Promise<ICount>;

    addCount: (int) => void;
}