import { ICounterService } from '../interfaces';
import { Counter } from '../generated-models';
import { ServiceBroker, ServiceSettingSchema } from 'moleculer';
import { injectable, inject, tagged } from 'inversify';
import { TaggedType } from '@common-stack/core';
import { CounterCommands, NATS_MOLECULER_COUNTER_SERIVCE } from '../constants';

/**
 * Proxies all calls to CounterMock service through Moleculer Borker
 */
@injectable()
export class CounterMockProxyService implements ICounterService {

    constructor(
        @inject('MoleculerBroker')
        private broker: ServiceBroker,

        @inject('Settings')
        @tagged(TaggedType.MICROSERVICE, true)
        private settings,
    ) {

    }

    private topic = NATS_MOLECULER_COUNTER_SERIVCE;

    public counterQuery() {
        return this.broker.call<Counter>(this.fullActionName(CounterCommands.COUNTER_QUERY));
    }

    public addCounter(amount?: number) {
        return this.broker.call(this.fullActionName(CounterCommands.ADD_COUNTER), { amount });
    }
    private fullActionName(subCommand: string) {
        return `${this.settings.subTopic}.${this.topic}.${subCommand}`;
    }
}
