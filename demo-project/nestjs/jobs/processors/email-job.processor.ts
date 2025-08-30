import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

export interface EmailJobData {
  to: string;
  subject: string;
  body: string;
  userId?: number;
}

@Processor('emailQueue')
export class EmailJobProcessor extends WorkerHost {
  async process(job: Job<EmailJobData>): Promise<void> {
    console.log(`📧 Processing email job: ${job.id}`);
    console.log(`📧 Job data:`, job.data);
    
    const { to, subject, body, userId } = job.data;
    
    // Simulate processing time for sending email
    await this.simulateEmailSending(to, subject, body);
    
    // Update job progress
    await job.updateProgress(50);
    
    // Simulate some additional processing
    if (userId) {
      await this.updateUserNotificationStatus(userId);
    }
    
    await job.updateProgress(100);
    
    console.log(`✅ Email sent successfully to ${to}`);
  }
  
  private async simulateEmailSending(to: string, subject: string, body: string): Promise<void> {
    // Simulate network delay and email service processing
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`📮 Email sent to ${to} with subject: "${subject}"`);
        resolve();
      }, 2000);
    });
  }
  
  private async updateUserNotificationStatus(userId: number): Promise<void> {
    // Simulate database update
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`📝 Updated notification status for user ${userId}`);
        resolve();
      }, 500);
    });
  }
}