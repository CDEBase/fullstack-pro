import { Container } from 'inversify';
import { ICounterRepository, CounterRepository } from './repository';
import { TYPES } from './constants';


export class RepositoryDiSetup {
    public setup(container: Container): void {
        container.bind<ICounterRepository>(TYPES.ICounterRepository).to(CounterRepository);
    }
}
