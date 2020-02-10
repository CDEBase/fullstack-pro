
import ZipkinService from 'moleculer-zipkin';
import { Service, ServiceBroker } from 'moleculer';


const SERVICE_NAME = 'GREETER-SERVICE';
export class GreeterService extends Service {


    constructor(broker: ServiceBroker) {
        super(broker);
        this.parseServiceSchema({
            name: SERVICE_NAME,
            version: 2,
            mixins: [ZipkinService],
            settings: {

            },
            actions: {
                hello: this.hello,
                welcome: {
                    cache: {
                        keys: ['name'],
                    },
                    params: {
                        name: 'string',
                    },
                    handler: this.welcome,
                } as any,
            },
            events: {
                'user.created': this.userCreated,
            },
            created: this.serviceCreated,
            started: this.serviceStarted,
            stopped: this.serviceStopped,
        });
    }


    private hello() {
        return 'Hello Moleculer';
    }

    private welcome(ctx: { params: { name: string }}) {
        return this.sayWelcome(ctx.params.name);
    }

    private sayWelcome(name: string) {
        this.logger.info('Say hello to', name);
        return `Welcome, ${name}`;
    }

    // Event handler
    public userCreated(user: string) {
        this.broker.call('mail.send', { user });
    }

    public serviceCreated() {
        this.logger.info('ES6 Service created.');
    }

    public async serviceStarted() {
        this.logger.info('ES6 SErvice started.');
    }

    public async serviceStopped() {
        this.logger.info('ES6 Service stopped.');
    }
}
