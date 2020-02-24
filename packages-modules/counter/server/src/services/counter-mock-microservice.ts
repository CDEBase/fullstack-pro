import { ServiceBroker, ServiceSettingSchema, Service, Context } from 'moleculer';
import { injectable, inject, Container } from 'inversify';
import { ICounterService } from '../interfaces';
import { CounterCommands, NATS_MOLECULER_COUNTER_SERIVCE, TYPES } from '../constants';

/**
 * Exposes CounterMock services by registering to the Moleculer Broker.
 * Note: This class is not injectable.
 */
export class CounterMockMicroservice extends Service {

    private counterMock: ICounterService;
    constructor(broker: ServiceBroker, { container, ...settings }: { container: Container } & { subTopic: string }) {
        super(broker);

        const topic = NATS_MOLECULER_COUNTER_SERIVCE;
        this.counterMock = container.get<ICounterService>(TYPES.CounterMockService);
        this.parseServiceSchema({
            name: topic,
            actions: {
                [CounterCommands.ADD_COUNTER]: {
                    handler: async (ctx: Context<{ amount?: number }>) => {
                        return await this.counterMock.addCounter(ctx.params.amount);
                    },
                },
                [CounterCommands.COUNTER_QUERY]: {
                    handler: async (ctx: Context) => {
                        return await this.counterMock.counterQuery();
                    },
                },
            },
        });

    }

}
