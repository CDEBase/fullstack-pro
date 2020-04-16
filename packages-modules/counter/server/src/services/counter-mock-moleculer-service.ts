import { ServiceBroker, ServiceSettingSchema, Service, Context } from 'moleculer';
import { injectable, inject, Container } from 'inversify';
import { ICounterService } from '../interfaces';
import { CounterCommands, NATS_MOLECULER_COUNTER_SERIVCE, TYPES } from '../constants';

/**
 * Exposes CounterMock services by registering to the Moleculer Broker.
 * Note: This class is not injectable.
 */
export class CounterMockMoleculerService extends Service {

    private counterMock: ICounterService;
    constructor(broker: ServiceBroker, { container, settings }: { container: Container } & { settings: any  }) {
        super(broker);
        const { subTopic } = settings;
        console.log('---SUBTOPIC ', subTopic);
        const topic = NATS_MOLECULER_COUNTER_SERIVCE;
        this.counterMock = container.get<ICounterService>(TYPES.CounterMockService);
        this.parseServiceSchema({
            name: topic,
            version: subTopic,
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
