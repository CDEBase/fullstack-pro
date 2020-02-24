import { ServiceBroker, ServiceSettingSchema } from 'moleculer';
import * as brokerConfig from '../config/moleculer.config';

export const broker = new ServiceBroker({ ...brokerConfig });

broker.start();
