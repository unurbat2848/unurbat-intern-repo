import { Injectable, Scope } from '@nestjs/common';

// This service uses TRANSIENT scope - new instance every time it's injected
@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  private instanceId: string;

  constructor() {
    // Each instance gets a unique ID to show it's a new instance
    this.instanceId = Math.random().toString(36).substring(7);
    console.log(`Logger instance created: ${this.instanceId}`);
  }

  log(message: string) {
    console.log(`[${this.instanceId}] ${new Date().toISOString()}: ${message}`);
  }

  getInstanceId() {
    return this.instanceId;
  }
}