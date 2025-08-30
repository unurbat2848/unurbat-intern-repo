const { Queue, Worker } = require('bullmq');
const Redis = require('redis');

// Create Redis connection for manual exploration
const redis = Redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
});

// Create a simple queue
const emailQueue = new Queue('exploration-queue', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
});

async function exploreRedisStorage() {
  try {
    console.log('🔍 Exploring how Redis stores BullMQ jobs...\n');
    
    // Connect to Redis
    await redis.connect();
    
    // 1. Add some jobs to the queue
    console.log('1. Adding jobs to queue...');
    const job1 = await emailQueue.add('send-email', {
      to: 'test@example.com',
      subject: 'Test Email 1',
      priority: 10
    });
    
    const job2 = await emailQueue.add('send-email', {
      to: 'test2@example.com', 
      subject: 'Test Email 2',
      priority: 5
    }, {
      delay: 5000 // Delay by 5 seconds
    });
    
    console.log(`✅ Added job ${job1.id} and ${job2.id}\n`);
    
    // 2. Explore Redis keys created by BullMQ
    console.log('2. Redis keys created by BullMQ:');
    const keys = await redis.keys('bull:exploration-queue:*');
    keys.forEach(key => console.log(`   📝 ${key}`));
    console.log('');
    
    // 3. Examine specific Redis data structures
    console.log('3. Exploring Redis data structures:');
    
    // Check waiting jobs list
    const waitingJobs = await redis.lRange('bull:exploration-queue:waiting', 0, -1);
    console.log(`   📋 Waiting jobs: ${waitingJobs.length}`);
    waitingJobs.forEach(jobId => console.log(`      - Job ID: ${jobId}`));
    
    // Check delayed jobs (sorted set)
    const delayedJobs = await redis.zRangeWithScores('bull:exploration-queue:delayed', 0, -1);
    console.log(`   ⏱️  Delayed jobs: ${delayedJobs.length}`);
    delayedJobs.forEach(item => {
      console.log(`      - Job ID: ${item.value}, Timestamp: ${new Date(item.score)}`);
    });
    
    // Check job data (hash)
    const jobData1 = await redis.hGetAll(`bull:exploration-queue:${job1.id}`);
    console.log(`   📊 Job ${job1.id} data:`, JSON.stringify(jobData1, null, 2));
    
    console.log('');
    
    // 4. Show how Redis manages job states
    console.log('4. Job state management:');
    console.log('   📝 BullMQ uses Redis lists, sets, and hashes to manage:');
    console.log('      - Lists: waiting, active, completed, failed jobs');
    console.log('      - Sorted Sets: delayed and priority queues');
    console.log('      - Hashes: individual job data and metadata');
    console.log('      - Sets: job dependencies and child references');
    console.log('');
    
    // 5. Queue statistics from Redis
    console.log('5. Queue statistics:');
    const waitingCount = await redis.lLen('bull:exploration-queue:waiting');
    const activeCount = await redis.lLen('bull:exploration-queue:active');
    const completedCount = await redis.lLen('bull:exploration-queue:completed');
    const failedCount = await redis.lLen('bull:exploration-queue:failed');
    
    console.log(`   📊 Waiting: ${waitingCount}`);
    console.log(`   🔄 Active: ${activeCount}`);
    console.log(`   ✅ Completed: ${completedCount}`);
    console.log(`   ❌ Failed: ${failedCount}`);
    
  } catch (error) {
    console.error('❌ Error exploring Redis:', error.message);
    console.log('\n💡 Note: Make sure Redis is running on localhost:6379');
    console.log('   You can start Redis with: redis-server');
    console.log('   Or using Docker: docker run -p 6379:6379 redis:alpine');
  } finally {
    // Cleanup
    await redis.disconnect();
    await emailQueue.close();
    process.exit(0);
  }
}

// Run the exploration
exploreRedisStorage();