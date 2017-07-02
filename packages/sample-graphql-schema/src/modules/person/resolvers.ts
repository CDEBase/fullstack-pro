import { PubSub } from 'graphql-subscriptions';

export const resolver = (pubsub: PubSub) =>  ({
    PersonType: {
        matches(root, args, ctx) {
            return ctx.persons.filter(person => person.sex !== root.sex);
        },
    },
    Query: {
        getPerson(root, args, ctx) {
            return ctx.findPerson(ctx.persons, args.id);
        },
        persons(root, args, ctx) {
            return ctx.persons;
        },
    },
    Mutation: {
        addPerson(root, args, ctx) {
            return ctx.addPerson(ctx.persons, { id: Math.random().toString(16).substr(2), name: args.name, sex: args.sex });
        },
    },
    Subscription: {
        clock(root) {
            return new Date();
        },
    },
});
