import { injectable } from 'inversify';
import { ICounterService } from '../interfaces';

@injectable()
export class CounterMockService implements ICounterService {
    private amount: number;

    constructor() {
        this.amount = 0;
    }

    public counterQuery() {
        return {
            amount: this.amount,
        };
    }

    public addCounter(amount) {
        if (amount) {
            this.amount += amount;
        } else {
            this.amount++;
        }
    }
}

// to make this instance singleton.
const counterMock = new CounterMockService();

export { counterMock };
