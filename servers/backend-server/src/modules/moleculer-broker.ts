import { ServiceBroker, ServiceSettingSchema } from 'moleculer';
import * as brokerConfig from './moleculer.config';

export const broker = new ServiceBroker({ ...brokerConfig });

broker.start();
