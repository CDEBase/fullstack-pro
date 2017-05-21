import { PubSub, SubscriptionManager } from "graphql-subscriptions";
import { schema } from "./schema";
import { Observable } from 'rxjs';

const pubsub = new PubSub();
const subscriptionManager = new SubscriptionManager({
    schema,
    pubsub,
    setupFunctions: {

    },
});

export { subscriptionManager, pubsub };

Observable.interval(1000)
.map(() => new Date())
.subscribe((clock: Date) => {
    pubsub.publish("clock", clock);
})