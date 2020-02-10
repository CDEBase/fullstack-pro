
import { Counter } from '../generated-models';

export interface ICounterService {

    counterQuery(): Counter | PromiseLike<Counter> | Promise<Counter>;

    addCounter(amount?: number);
}
