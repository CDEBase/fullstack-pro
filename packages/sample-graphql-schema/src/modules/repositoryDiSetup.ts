import { Container } from 'inversify'
import { ICounterRepository, CounterRepository, TYPES} from './counter/database';


export class RepositoryDiSetup {
    setup( container: Container): void {
        container.bind<ICounterRepository>(TYPES.ICounterRepository).to(CounterRepository);
    }
}