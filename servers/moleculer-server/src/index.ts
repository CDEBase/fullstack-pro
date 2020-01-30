import { GreeterService } from './greeter-service';
import { ServiceBroker } from 'moleculer';


let broker = new ServiceBroker();

broker.createService(GreeterService);
