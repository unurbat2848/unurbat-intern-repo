import { Injectable, Logger } from '@nestjs/common';

interface ProcessingStep {
  step: number;
  name: string;
  data: any;
  timestamp: string;
}

interface ComplexCalculationResult {
  original: number;
  steps: ProcessingStep[];
  final: number;
  processingTime: number;
}

@Injectable()
export class DebugService {
  private readonly logger = new Logger('DebugService');
  
  async processComplexData(inputNumber: number): Promise<ComplexCalculationResult> {
    const startTime = Date.now();
    const steps: ProcessingStep[] = [];
    let currentValue = inputNumber;
    
    // Step 1: Double the number
    currentValue = this.doubleValue(currentValue);
    steps.push({
      step: 1,
      name: 'Double Value',
      data: currentValue,
      timestamp: new Date().toISOString()
    });
    
    // Step 2: Add complex calculation
    currentValue = await this.performAsyncCalculation(currentValue);
    steps.push({
      step: 2,
      name: 'Async Calculation',
      data: currentValue,
      timestamp: new Date().toISOString()
    });
    
    // Step 3: Apply validation and transform
    const validatedValue = this.validateAndTransform(currentValue);
    steps.push({
      step: 3,
      name: 'Validate & Transform',
      data: validatedValue,
      timestamp: new Date().toISOString()
    });
    
    const endTime = Date.now();
    const processingTime = endTime - startTime;
    
    this.logger.log(`Processing completed in ${processingTime}ms`);
    
    return {
      original: inputNumber,
      steps,
      final: validatedValue,
      processingTime
    };
  }
  
  private doubleValue(value: number): number {
    // Good breakpoint location - simple calculation
    const result = value * 2;
    this.logger.debug(`Doubled ${value} to ${result}`);
    return result;
  }
  
  private async performAsyncCalculation(value: number): Promise<number> {
    // Good breakpoint location - async operation
    return new Promise((resolve) => {
      setTimeout(() => {
        const multiplier = this.getMultiplier(value);
        const result = value + (value * multiplier);
        this.logger.debug(`Applied multiplier ${multiplier} to ${value}, result: ${result}`);
        resolve(result);
      }, 100); // Small delay to simulate async work
    });
  }
  
  private getMultiplier(value: number): number {
    // Good breakpoint location - conditional logic
    if (value < 10) {
      return 0.1; // 10% increase
    } else if (value < 100) {
      return 0.2; // 20% increase
    } else if (value < 1000) {
      return 0.3; // 30% increase
    } else {
      return 0.5; // 50% increase
    }
  }
  
  private validateAndTransform(value: number): number {
    // Good breakpoint location - validation logic
    if (value < 0) {
      this.logger.warn('Negative value detected, converting to positive');
      return Math.abs(value);
    }
    
    if (value > 10000) {
      this.logger.warn('Value too large, capping at 10000');
      return 10000;
    }
    
    // Round to 2 decimal places
    const rounded = Math.round(value * 100) / 100;
    this.logger.debug(`Validated and rounded ${value} to ${rounded}`);
    return rounded;
  }
  
  debugDataFlow(inputArray: number[]): any {
    // Good breakpoint location - array processing with multiple steps
    const processedData = inputArray
      .filter(num => num > 0) // Filter positive numbers
      .map(num => ({
        original: num,
        doubled: num * 2,
        squared: num * num
      }))
      .sort((a, b) => b.squared - a.squared); // Sort by squared value descending
    
    const summary = {
      totalItems: processedData.length,
      averageOriginal: processedData.reduce((sum, item) => sum + item.original, 0) / processedData.length,
      maxSquared: processedData.length > 0 ? processedData[0].squared : 0,
      minSquared: processedData.length > 0 ? processedData[processedData.length - 1].squared : 0
    };
    
    this.logger.log(`Processed ${inputArray.length} items, kept ${processedData.length} positive items`);
    
    return {
      originalArray: inputArray,
      processedData,
      summary
    };
  }
  
  simulateNestedFunction(depth: number): any {
    // Good breakpoint location - recursive/nested function calls
    const callStack: string[] = [];
    
    const recursiveFunction = (currentDepth: number): number => {
      callStack.push(`Depth: ${currentDepth}`);
      
      if (currentDepth === 0) {
        return 1;
      }
      
      const previousResult = recursiveFunction(currentDepth - 1);
      const currentResult = previousResult * currentDepth;
      
      this.logger.debug(`Depth ${currentDepth}: ${previousResult} * ${currentDepth} = ${currentResult}`);
      
      return currentResult;
    };
    
    const result = recursiveFunction(depth);
    
    return {
      requestedDepth: depth,
      finalResult: result,
      callStack: callStack.reverse(), // Reverse to show call order
      explanation: `Calculated factorial of ${depth} = ${result}`
    };
  }
}