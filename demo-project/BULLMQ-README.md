# BullMQ Background Jobs with Redis in NestJS

This project demonstrates how to implement background job processing using **BullMQ** and **Redis** in a NestJS application.

## 🚀 Quick Start

### Prerequisites
- Redis server running on `localhost:6379`
- Node.js and npm installed

### Start Redis
```bash
# Option 1: Install and run Redis locally
redis-server

# Option 2: Use Docker
docker run -p 6379:6379 redis:alpine
```

### Run the Application
```bash
npm install
npm run build
npm run start:dev
```

## 📋 API Endpoints

### 1. Create Demo Jobs
```bash
POST http://localhost:3000/api/jobs/demo
```
Creates sample email jobs for testing.

### 2. Add Single Email Job
```bash
POST http://localhost:3000/api/jobs/email
Content-Type: application/json

{
  "to": "user@example.com",
  "subject": "Hello from BullMQ",
  "body": "This is a background job test",
  "userId": 123
}
```

### 3. Add Bulk Email Jobs
```bash
POST http://localhost:3000/api/jobs/email/bulk
Content-Type: application/json

[
  {
    "to": "user1@example.com",
    "subject": "Bulk Email 1",
    "body": "First bulk email"
  },
  {
    "to": "user2@example.com", 
    "subject": "Bulk Email 2",
    "body": "Second bulk email"
  }
]
```

### 4. Add Data Processing Job
```bash
POST http://localhost:3000/api/jobs/data-processing
Content-Type: application/json

{
  "filePath": "/uploads/data.csv",
  "userId": 123,
  "processingType": "csv"
}
```

### 5. Get Queue Statistics
```bash
GET http://localhost:3000/api/jobs/stats
```

### 6. Get Job Status
```bash
GET http://localhost:3000/api/jobs/{jobId}/status
```

## 🔍 Exploring Redis Data

Run the Redis exploration script:
```bash
node redis-exploration.js
```

This script demonstrates:
- How BullMQ stores jobs in Redis
- Redis data structures used (lists, sets, hashes)
- Job state management
- Queue statistics

## 🏗️ Architecture Overview

### Queue Setup (`app.module.ts`)
```typescript
BullModule.forRoot({
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
})
```

### Queue Registration (`jobs.module.ts`)
```typescript
BullModule.registerQueue({
  name: 'emailQueue',
}),
BullModule.registerQueue({
  name: 'dataProcessingQueue',
})
```

### Job Processors
- **EmailJobProcessor**: Handles email sending jobs
- **DataProcessingJobProcessor**: Handles file processing jobs

### Job Service
- Adds jobs to queues with retry logic
- Manages job priorities and delays
- Provides job status monitoring

## 📊 Redis Data Structures Used by BullMQ

### Lists
- `bull:{queueName}:waiting` - Jobs waiting to be processed
- `bull:{queueName}:active` - Currently processing jobs
- `bull:{queueName}:completed` - Successfully completed jobs
- `bull:{queueName}:failed` - Failed jobs

### Sorted Sets
- `bull:{queueName}:delayed` - Jobs scheduled for future execution
- `bull:{queueName}:prioritized` - Priority queue for jobs

### Hashes
- `bull:{queueName}:{jobId}` - Individual job data and metadata

### Sets
- `bull:{queueName}:stalled` - Jobs that may be stalled
- Job dependencies and child references

## ⚡ Performance Features

1. **Concurrency**: Multiple workers can process jobs in parallel
2. **Priority Queues**: High-priority jobs processed first
3. **Delayed Jobs**: Schedule jobs for future execution
4. **Retry Logic**: Automatic retry with exponential backoff
5. **Job Progress**: Real-time progress tracking
6. **Rate Limiting**: Control processing speed

## 🛠️ Configuration Options

### Job Options
```typescript
await queue.add('jobName', jobData, {
  attempts: 3,                    // Retry attempts
  backoff: 'exponential',         // Retry strategy
  delay: 5000,                    // Delay in milliseconds
  priority: 10,                   // Job priority (higher = more priority)
  removeOnComplete: 100,          // Keep only last 100 completed jobs
  removeOnFail: 50,              // Keep only last 50 failed jobs
});
```

### Queue Configuration
```typescript
const queue = new Queue('queueName', {
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 5,
  },
  connection: redisConfig,
});
```

## 🧪 Testing Job Processing

1. Start the application: `npm run start:dev`
2. Create demo jobs: `POST /api/jobs/demo`
3. Watch console logs for job processing
4. Check queue stats: `GET /api/jobs/stats`
5. Monitor specific job: `GET /api/jobs/{jobId}/status`

## 🔧 Environment Variables

```bash
REDIS_HOST=localhost
REDIS_PORT=6379
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=nestuser
DB_PASSWORD=nestpass
DB_NAME=nestdb
```

## 📝 Job Flow Example

1. **Client Request**: POST /api/jobs/email
2. **Job Creation**: JobsService adds job to Redis queue
3. **Job Processing**: EmailJobProcessor picks up job
4. **Progress Updates**: Job progress tracked in Redis
5. **Completion**: Job marked as completed in Redis
6. **Client Notification**: Status available via API

This setup provides a robust, scalable background job processing system that keeps your main API responsive while handling time-consuming tasks asynchronously.