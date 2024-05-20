import Redis from 'ioredis';
import { config } from './env-config';

let redisClient;

export function getRedisClient() {
    if (!redisClient) {
        // Initialize Redis client if it doesn't exist
        redisClient = new Redis(config.REDIS_URL);
    }
    return redisClient;
}