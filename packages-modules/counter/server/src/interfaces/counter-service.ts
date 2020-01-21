

export interface ICounterResult {
    amount: number;
}

export interface ICounterService {

    counterQuery(): ICounterResult;

    addCounter(amount?: number);
}
