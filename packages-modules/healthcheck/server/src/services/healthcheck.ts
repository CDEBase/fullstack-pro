import Redis from 'ioredis';
import * as Nats from 'nats';
import { injectable } from 'inversify';
import * as Mongoose from 'mongoose';

import * as RedisHealthcheck from 'redis-healthcheck';
import * as MongoHealthcheck from 'mongo-healthcheck';
import * as NodejsHealthcheck from '@hmcts/nodejs-healthcheck';

@injectable()
export class HealthCheck {
  public async redis(host?: string): Promise<boolean> {
    const client = new Redis({ host: host || process.env.REDIS_URL });

    return new Promise((resolve, reject) => {
      const redisHealthcheck = RedisHealthcheck({
        client,
        name: host,
        memoryThreshold: 10485760,
      });

      redisHealthcheck.checkStatus((err) => {
        if (err) {
          return reject(err);
        }

        return resolve(true);
      });
    });
  }

  public async mongo(host?: string): Promise<boolean> {
    const connection = Mongoose.connect(host || process.env.MONGO_URL);

    return connection
      .then(conn => {
        try {
          return !!MongoHealthcheck(conn);
        } catch (err) {
          throw new Error(err);
        }
      });
  }

  public async nats(host?: string, topic?: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        const client = Nats.connect(host ? { url: host } : {
          url: process.env.NATS_URL,
          user: process.env.NATS_USER,
          pass: process.env.NATS_PW,
      });

      client.on('error', (err) => reject(err));
      client.on('connect', () => resolve(true));
      } catch (e) {
        throw new Error(e);
      }
    });
  }

  public async custom(host?: string): Promise<boolean> {
    return NodejsHealthcheck.web(host).call()
      .then(result => {
        if (!result || result.status === 'DOWN' || 'errno' in result) {
          throw new Error(result.code);
        }

        return true;
    });
  }
}
