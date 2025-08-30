import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EmailJobProcessor } from './processors/email-job.processor';
import { DataProcessingJobProcessor } from './processors/data-processing-job.processor';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'emailQueue',
    }),
    BullModule.registerQueue({
      name: 'dataProcessingQueue',
    }),
  ],
  controllers: [JobsController],
  providers: [EmailJobProcessor, DataProcessingJobProcessor, JobsService],
})
export class JobsModule {}