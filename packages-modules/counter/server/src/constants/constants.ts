


export const NATS_MOLECULER_COUNTER_SERIVCE = 'NATS_MOLECULER_COUNTER_SERIVCE';


export enum CounterCommands {
    COUNTER_QUERY = 'COUNTER_QUERY',
    ADD_COUNTER = 'ADD_COUNTER',
}


export const TYPES = {
    CounterMockService: Symbol('CounterMockService'),
    CounterMockMicroservice: Symbol('CounterMockMicroservice'),
    CounterMockRemoteService: Symbol('CounterMockRemoteService'),
};
