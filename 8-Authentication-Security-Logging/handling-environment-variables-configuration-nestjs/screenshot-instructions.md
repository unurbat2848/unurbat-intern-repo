# Screenshot Instructions for Handling Environment Variables & Configuration in NestJS

Take screenshots to document your environment variable and configuration implementation and save them in the `8-Authentication-Security-Logging/handling-environment-variables-configuration-nestjs/` folder.

## Screenshot 1: ConfigModule Setup
- **Filename**: `image.png`
- **Location**: Save in `8-Authentication-Security-Logging/handling-environment-variables-configuration-nestjs/`
- **What to capture**: Open `demo-project/nestjs/config/config.module.ts` in VS Code
- **Show**: The ConfigModule.forRoot() setup with all configuration files loaded, validation schema, and environment file priority
- **Referenced in**: "How does @nestjs/config help manage environment variables?" section

## Screenshot 2: Joi Validation Schema
- **Filename**: `image-1.png`
- **Location**: Save in `8-Authentication-Security-Logging/handling-environment-variables-configuration-nestjs/`
- **What to capture**: Open `demo-project/nestjs/config/validation.schema.ts` in VS Code
- **Show**: The Joi validation schema with different validation rules, required fields, and conditional validation
- **Referenced in**: "How does @nestjs/config help manage environment variables?" section

## Screenshot 3: Environment Example File
- **Filename**: `image-2.png`
- **Location**: Save in `8-Authentication-Security-Logging/handling-environment-variables-configuration-nestjs/`
- **What to capture**: Open `demo-project/.env.example` in VS Code
- **Show**: The template file with safe example values and comments explaining each variable
- **Referenced in**: "Why should secrets (e.g., API keys, database passwords) never be stored in source code?" section

## Screenshot 4: GitIgnore Protection
- **Filename**: `image-3.png`
- **Location**: Save in `8-Authentication-Security-Logging/handling-environment-variables-configuration-nestjs/`
- **What to capture**: Open `demo-project/.gitignore` in VS Code
- **Show**: The .gitignore file with environment variable files and security-related exclusions
- **Referenced in**: "Why should secrets (e.g., API keys, database passwords) never be stored in source code?" section

## Screenshot 5: Joi Schema Details
- **Filename**: `image-4.png`
- **Location**: Save in `8-Authentication-Security-Logging/handling-environment-variables-configuration-nestjs/`
- **What to capture**: Open `demo-project/nestjs/config/validation.schema.ts` in VS Code (different section)
- **Show**: Focus on specific validation rules like conditional requirements, min/max values, and allowed values
- **Referenced in**: "How can you validate environment variables before the app starts?" section

## Screenshot 6: Class-Validator Approach
- **Filename**: `image-5.png`
- **Location**: Save in `8-Authentication-Security-Logging/handling-environment-variables-configuration-nestjs/`
- **What to capture**: Open `demo-project/nestjs/config/environment-variables.ts` in VS Code
- **Show**: The class-based validation approach with decorators and the validate function
- **Referenced in**: "How can you validate environment variables before the app starts?" section

## Screenshot 7: Environment-Specific Configuration
- **Filename**: `image-6.png`
- **Location**: Save in `8-Authentication-Security-Logging/handling-environment-variables-configuration-nestjs/`
- **What to capture**: Open `demo-project/nestjs/config/database.config.ts` in VS Code
- **Show**: Environment-aware configuration showing different settings based on NODE_ENV
- **Referenced in**: "How can you separate configuration for different environments (e.g., local vs. production)?" section

## Screenshot 8: Configuration Controller
- **Filename**: `image-7.png`
- **Location**: Save in `8-Authentication-Security-Logging/handling-environment-variables-configuration-nestjs/`
- **What to capture**: Open `demo-project/nestjs/config/config.controller.ts` in VS Code
- **Show**: Methods showing safe vs masked configuration values and the secrets demo endpoint
- **Referenced in**: "How can you separate configuration for different environments (e.g., local vs. production)?" section

## Screenshot 9: App Module Integration
- **Filename**: `image-8.png`
- **Location**: Save in `8-Authentication-Security-Logging/handling-environment-variables-configuration-nestjs/`
- **What to capture**: Open `demo-project/nestjs/app.module.ts` in VS Code
- **Show**: TypeORM and BullMQ using ConfigService with forRootAsync pattern
- **Referenced in**: "How can you separate configuration for different environments (e.g., local vs. production)?" section