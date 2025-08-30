import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
  
  // Connection settings
  connectTimeout: 10000,
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  retryDelayOnClusterDown: 300,
  retryDelayOnFailover: 100,
  
  // Cluster settings (for production)
  enableReadyCheck: true,
  
  // Redis URL for cloud providers (overrides individual settings)
  url: process.env.REDIS_URL,
}));