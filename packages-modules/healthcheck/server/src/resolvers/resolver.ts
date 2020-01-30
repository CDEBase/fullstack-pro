export const resolver = (options) => ({
  Query: {
    health(obj, { request }: { request: { type: string, host?: string, topic?: string } }, context) {
      switch (request.type) {
        case 'Mongo':
          return context.healthcheck.mongo(request.host);
        case 'Redis':
          return context.healthcheck.redis(request.host);
        case 'Nats':
          return context.healthcheck.nats(request.host, request.topic);
        default:
          return context.healthcheck.custom(request.host);
      }
    },
  },
});
