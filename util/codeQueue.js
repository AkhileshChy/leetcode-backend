import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const useTLS = process.env.REDIS_TLS === 'true';

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  username: process.env.REDIS_USERNAME || undefined,  // Redis 6+ ACLs
  password: process.env.REDIS_PASSWORD,
  tls: undefined, // Enable TLS if flagged
});

export const codeQueue = new Queue('codeQueue', {
  connection,
});
