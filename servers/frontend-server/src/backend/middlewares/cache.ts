import { createClient } from 'redis';
import { logger } from '@cdm-logger/server';
import { config } from '../../config';

const client = createClient({ url: config.REDIS_URL })

client.on('connect', ()=>logger.info('Redis Client connected in Client Server'));
client.on('error', err => logger.error('Redis Client Error', err));
// client.flushdb((err, succeeded) => logger.info(succeeded, err));

export const cacheMiddleware = (req, res, next) => {
  res.setHeader('Cache-Control', `public, max-age=300, s-maxage=3600`)

  const key = req.url
  client.get(key, (err, value) => {
    if (err == null && value != null) {
      res.send(value)
    } else {
      res.sendResponse = res.send
      res.send = async (body) => {
        const reply = await client.set(key, body, 'EX', 100)
        logger.info(`Redis Client set new value of key - ${key}`, reply)
        res.sendResponse(body)
      }
      next()
    }
  })
}