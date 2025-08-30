# Screenshot Instructions for Background Jobs with BullMQ & Redis in NestJS

Take screenshots to document your BullMQ implementation and save them in the `7-building-APIs/background-jobs-with-bullmq-redis-nestjs/` folder.

## Screenshot 1: BullMQ Configuration
- **Filename**: `image.png`
- **Location**: Save in `7-building-APIs/background-jobs-with-bullmq-redis-nestjs/`
- **What to capture**: Open `demo-project/nestjs/app.module.ts` in VS Code
- **Show**: The BullModule.forRoot() configuration with Redis connection settings
- **Referenced in**: "Why is BullMQ used instead of handling tasks directly in API requests?" section

## Screenshot 2: Jobs Module Setup
- **Filename**: `image-1.png`
- **Location**: Save in `7-building-APIs/background-jobs-with-bullmq-redis-nestjs/`
- **What to capture**: Open `demo-project/nestjs/jobs/jobs.module.ts` in VS Code
- **Show**: Queue registrations for emailQueue and dataProcessingQueue, plus all imports and providers
- **Referenced in**: "Why is BullMQ used instead of handling tasks directly in API requests?" section

## Screenshot 3: Redis Data Structures Script
- **Filename**: `image-2.png`
- **Location**: Save in `7-building-APIs/background-jobs-with-bullmq-redis-nestjs/`
- **What to capture**: Open `demo-project/redis-exploration.js` in VS Code
- **Show**: The script code that explores Redis data structures and job storage
- **Referenced in**: "How does Redis help manage job queues in BullMQ?" section

## Screenshot 4: Redis Keys Output
- **Filename**: `image-3.png`
- **Location**: Save in `7-building-APIs/background-jobs-with-bullmq-redis-nestjs/`
- **What to capture**: Terminal running `node redis-exploration.js` command
- **Show**: Output showing Redis keys, job data structures, and queue statistics
- **Referenced in**: "How does Redis help manage job queues in BullMQ?" section

## Screenshot 5: Email Job Processor
- **Filename**: `image-4.png`
- **Location**: Save in `7-building-APIs/background-jobs-with-bullmq-redis-nestjs/`
- **What to capture**: Open `demo-project/nestjs/jobs/processors/email-job.processor.ts` in VS Code
- **Show**: The @Processor decorator, process method, and retry configuration
- **Referenced in**: "What happens if a job fails? How can failed jobs be retried?" section

## Screenshot 6: Data Processing Processor
- **Filename**: `image-5.png`
- **Location**: Save in `7-building-APIs/background-jobs-with-bullmq-redis-nestjs/`
- **What to capture**: Open `demo-project/nestjs/jobs/processors/data-processing-job.processor.ts` in VS Code
- **Show**: The processor implementation with error handling and progress tracking
- **Referenced in**: "What happens if a job fails? How can failed jobs be retried?" section

## Screenshot 7: Jobs Service
- **Filename**: `image-6.png`
- **Location**: Save in `7-building-APIs/background-jobs-with-bullmq-redis-nestjs/`
- **What to capture**: Open `demo-project/nestjs/jobs/jobs.service.ts` in VS Code
- **Show**: Service methods for adding different types of jobs with configurations
- **Referenced in**: "How does Focus Bear use BullMQ for background tasks?" section

## Screenshot 8: Jobs Controller
- **Filename**: `image-7.png`
- **Location**: Save in `7-building-APIs/background-jobs-with-bullmq-redis-nestjs/`
- **What to capture**: Open `demo-project/nestjs/jobs/jobs.controller.ts` in VS Code
- **Show**: API endpoints for creating and managing background jobs
- **Referenced in**: "How does Focus Bear use BullMQ for background tasks?" section

## Screenshot 9: Job Processing Demo
- **Filename**: `image-8.png`
- **Location**: Save in `7-building-APIs/background-jobs-with-bullmq-redis-nestjs/`
- **What to capture**: Postman or browser making POST request to `/api/jobs/demo` endpoint
- **Show**: Successful API response and any console output showing job processing
- **Referenced in**: "How does Focus Bear use BullMQ for background tasks?" section