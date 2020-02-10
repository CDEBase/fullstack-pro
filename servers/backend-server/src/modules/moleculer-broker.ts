import { ServiceBroker, ServiceSettingSchema } from 'moleculer';
import * as brokerConfig from './moleculer.config';


console.log('--BROKER CONFIG', brokerConfig)
export const broker = new ServiceBroker({ ...brokerConfig });

broker.start();
