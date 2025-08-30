import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { EmailJobData } from './processors/email-job.processor';

export interface DataProcessingJobData {
  filePath: string;
  userId: number;
  processingType: 'csv' | 'json' | 'xml';
}

@Injectable()
export class JobsService {
  constructor(
    @InjectQueue('emailQueue') private emailQueue: Queue,
    @InjectQueue('dataProcessingQueue') private dataProcessingQueue: Queue,
  ) {}

  async addEmailJob(emailData: EmailJobData): Promise<string> {
    const job = await this.emailQueue.add('sendEmail', emailData, {
      attempts: 3, // Retry up to 3 times if job fails
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
    
    console.log(`📬 Email job added to queue with ID: ${job.id}`);
    return job.id || 'unknown';
  }

  async addBulkEmailJobs(emailDataList: EmailJobData[]): Promise<string[]> {
    const jobs = emailDataList.map((emailData, index) => ({
      name: 'sendEmail',
      data: emailData,
      opts: {
        delay: index * 1000, // Stagger emails by 1 second each
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    }));

    const addedJobs = await this.emailQueue.addBulk(jobs);
    const jobIds = addedJobs.map(job => job.id || 'unknown');
    
    console.log(`📬 ${jobIds.length} bulk email jobs added to queue`);
    return jobIds;
  }

  async addDataProcessingJob(processingData: DataProcessingJobData): Promise<string> {
    const job = await this.dataProcessingQueue.add('processData', processingData, {
      priority: 10, // Higher priority for data processing
      attempts: 2,
    });
    
    console.log(`📊 Data processing job added to queue with ID: ${job.id}`);
    return job.id || 'unknown';
  }

  async getEmailQueueStats() {
    const waiting = await this.emailQueue.getWaiting();
    const active = await this.emailQueue.getActive();
    const completed = await this.emailQueue.getCompleted();
    const failed = await this.emailQueue.getFailed();
    
    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
    };
  }

  async getJobStatus(jobId: string): Promise<any> {
    const job = await this.emailQueue.getJob(jobId);
    if (!job) {
      return { status: 'not_found' };
    }
    
    return {
      id: job.id,
      name: job.name,
      data: job.data,
      progress: job.progress,
      returnvalue: job.returnvalue,
      failedReason: job.failedReason,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      state: await job.getState(),
    };
  }
}