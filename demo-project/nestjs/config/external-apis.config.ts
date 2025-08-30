import { registerAs } from '@nestjs/config';

export default registerAs('externalApis', () => ({
  // OpenAI Configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORGANIZATION,
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000', 10),
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
  },
  
  // SendGrid Configuration
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
    fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@focusbear.app',
    fromName: process.env.SENDGRID_FROM_NAME || 'Focus Bear',
    templateIds: {
      welcome: process.env.SENDGRID_WELCOME_TEMPLATE,
      resetPassword: process.env.SENDGRID_RESET_PASSWORD_TEMPLATE,
      notification: process.env.SENDGRID_NOTIFICATION_TEMPLATE,
    },
  },
  
  // Slack Configuration
  slack: {
    webhookUrl: process.env.SLACK_WEBHOOK_URL,
    botToken: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    channels: {
      alerts: process.env.SLACK_ALERTS_CHANNEL || '#alerts',
      logs: process.env.SLACK_LOGS_CHANNEL || '#logs',
    },
  },
  
  // Stripe Configuration (for payments)
  stripe: {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    currency: process.env.STRIPE_CURRENCY || 'usd',
  },
  
  // AWS Configuration
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3: {
      bucket: process.env.AWS_S3_BUCKET,
      region: process.env.AWS_S3_REGION || process.env.AWS_REGION,
    },
    ses: {
      region: process.env.AWS_SES_REGION || process.env.AWS_REGION,
    },
  },
}));