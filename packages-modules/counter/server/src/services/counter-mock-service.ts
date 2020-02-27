import { injectable } from 'inversify';
import { ICounterService } from '../interfaces';


@injectable()
export class CounterMockService implements ICounterService {

  private _amount: number;

  constructor() {
    this._amount = 0;
  }

  public counterQuery() {
    return {
      amount: this._amount,
    };
  }

  public addCounter(amount) {
    if (amount) {
      this._amount = this._amount + amount;
    } else {
      this._amount++;
    }
  }
}

// to make this instance singleton.
const counterMock = new CounterMockService();

export { counterMock };
