import Redis from 'ioredis';

const redis = new Redis({
  host: 'localhost',
  port: 6379,
  // Add any other Redis configuration as needed
});

export default redis;
