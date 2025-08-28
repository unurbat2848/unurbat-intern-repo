import { Injectable, Scope } from '@nestjs/common';

// This service uses REQUEST scope - new instance for each HTTP request
@Injectable({ scope: Scope.REQUEST })
export class EmailService {
  private emailsSent: string[] = [];

  // Send welcome email
  sendWelcomeEmail(email: string, name: string) {
    const message = `Welcome ${name}! Email sent to ${email}`;
    this.emailsSent.push(message);
    console.log(message);
    return message;
  }

  // Send notification email
  sendNotification(email: string, message: string) {
    const notification = `Notification to ${email}: ${message}`;
    this.emailsSent.push(notification);
    console.log(notification);
    return notification;
  }

  // Get emails sent in this request
  getEmailHistory() {
    return this.emailsSent;
  }
}