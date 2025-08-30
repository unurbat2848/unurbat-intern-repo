import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

export interface DataProcessingJobData {
  filePath: string;
  userId: number;
  processingType: 'csv' | 'json' | 'xml';
}

@Processor('dataProcessingQueue')
export class DataProcessingJobProcessor extends WorkerHost {
  async process(job: Job<DataProcessingJobData>): Promise<any> {
    console.log(`📊 Processing data job: ${job.id}`);
    console.log(`📊 Job data:`, job.data);
    
    const { filePath, userId, processingType } = job.data;
    
    try {
      await job.updateProgress(10);
      
      // Simulate file validation
      await this.validateFile(filePath, processingType);
      await job.updateProgress(30);
      
      // Simulate data parsing
      const parsedData = await this.parseFile(filePath, processingType);
      await job.updateProgress(70);
      
      // Simulate data transformation
      const transformedData = await this.transformData(parsedData);
      await job.updateProgress(90);
      
      // Simulate saving processed data
      const result = await this.saveProcessedData(transformedData, userId);
      await job.updateProgress(100);
      
      console.log(`✅ Data processing completed for user ${userId}`);
      return result;
      
    } catch (error) {
      console.error(`❌ Data processing failed:`, error);
      throw error; // BullMQ will handle retry logic
    }
  }
  
  private async validateFile(filePath: string, type: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(`🔍 Validating ${type} file: ${filePath}`);
        
        // Simulate occasional validation failures
        if (Math.random() < 0.1) { // 10% chance of failure
          reject(new Error(`Invalid ${type} file format`));
        } else {
          resolve();
        }
      }, 1000);
    });
  }
  
  private async parseFile(filePath: string, type: string): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`📖 Parsing ${type} file: ${filePath}`);
        
        // Simulate parsed data based on type
        const mockData: Record<string, any> = {
          csv: [
            { id: 1, name: 'John Doe', email: 'john@example.com' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
          ],
          json: {
            users: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }],
            metadata: { source: 'import', timestamp: new Date() }
          },
          xml: { root: { user: [{ id: '1', name: 'John' }, { id: '2', name: 'Jane' }] } }
        };
        
        resolve(mockData[type] || []);
      }, 2000);
    });
  }
  
  private async transformData(rawData: any): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`🔄 Transforming data...`);
        
        // Simulate data transformation
        const transformed = {
          processedAt: new Date(),
          recordCount: Array.isArray(rawData) ? rawData.length : Object.keys(rawData).length,
          data: rawData,
          transformations: ['normalize_names', 'validate_emails', 'deduplicate']
        };
        
        resolve(transformed);
      }, 1500);
    });
  }
  
  private async saveProcessedData(data: any, userId: number): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`💾 Saving processed data for user ${userId}`);
        
        const result = {
          id: Math.floor(Math.random() * 10000),
          userId,
          recordCount: data.recordCount,
          processedAt: data.processedAt,
          status: 'completed'
        };
        
        resolve(result);
      }, 1000);
    });
  }
}