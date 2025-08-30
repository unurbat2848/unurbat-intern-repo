import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { EmailJobData } from './processors/email-job.processor';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('email')
  async addEmailJob(@Body() emailData: EmailJobData) {
    const jobId = await this.jobsService.addEmailJob(emailData);
    return {
      success: true,
      message: 'Email job added to queue',
      jobId,
    };
  }

  @Post('email/bulk')
  async addBulkEmailJobs(@Body() emailDataList: EmailJobData[]) {
    const jobIds = await this.jobsService.addBulkEmailJobs(emailDataList);
    return {
      success: true,
      message: `${jobIds.length} email jobs added to queue`,
      jobIds,
    };
  }

  @Post('data-processing')
  async addDataProcessingJob(
    @Body() processingData: {
      filePath: string;
      userId: number;
      processingType: 'csv' | 'json' | 'xml';
    }
  ) {
    const jobId = await this.jobsService.addDataProcessingJob(processingData);
    return {
      success: true,
      message: 'Data processing job added to queue',
      jobId,
    };
  }

  @Get('stats')
  async getQueueStats() {
    const stats = await this.jobsService.getEmailQueueStats();
    return {
      success: true,
      stats,
    };
  }

  @Get(':jobId/status')
  async getJobStatus(@Param('jobId') jobId: string) {
    const status = await this.jobsService.getJobStatus(jobId);
    return {
      success: true,
      job: status,
    };
  }

  @Post('demo')
  async createDemoJobs() {
    // Create some demo email jobs
    const demoEmails: EmailJobData[] = [
      {
        to: 'user1@example.com',
        subject: 'Welcome to our service!',
        body: 'Thank you for signing up.',
        userId: 1,
      },
      {
        to: 'user2@example.com',
        subject: 'Password reset request',
        body: 'Please click the link to reset your password.',
        userId: 2,
      },
      {
        to: 'admin@example.com',
        subject: 'Daily report',
        body: 'Here is your daily activity report.',
      },
    ];

    const jobIds = await this.jobsService.addBulkEmailJobs(demoEmails);
    
    return {
      success: true,
      message: 'Demo jobs created successfully',
      jobIds,
    };
  }
}