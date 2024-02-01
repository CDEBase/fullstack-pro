import Redis from 'ioredis';
import { logger } from '@cdm-logger/server';
import { config } from '../../config';

const redis = new Redis(config.REDIS_URL);

redis.on('connect', ()=>logger.info('Redis Client connected in Client Server'));
redis.on('error', err => logger.error('Redis Client Error', err));
// redis.flushdb((err, succeeded) => logger.info(succeeded, err));

export const cacheMiddleware = (req, res, next) => {
  res.setHeader('Cache-Control', `public, max-age=300, s-maxage=3600`)

  const key = req.url
  redis.get(key, (err, value) => {
    if (err == null && value != null) {
      res.send(value)
    } else {
      res.sendResponse = res.send
      res.send = async (body) => {
        const reply = await redis.set(key, body, 'EX', 300)
        logger.info(`Redis Client set new value of key - ${key}`, reply)
        res.sendResponse(body)
      }
      next()
    }
  })
}