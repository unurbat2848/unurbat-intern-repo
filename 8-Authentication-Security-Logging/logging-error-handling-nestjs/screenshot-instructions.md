# Screenshot Instructions for Logging & Error Handling in NestJS

Take screenshots to document your logging and error handling implementation and save them in the `8-Authentication-Security-Logging/logging-error-handling-nestjs/` folder.

## Screenshot 1: Pino Configuration
- **Filename**: `image.png`
- **Location**: Save in `8-Authentication-Security-Logging/logging-error-handling-nestjs/`
- **What to capture**: Open `demo-project/nestjs/logging/pino.config.ts` in VS Code
- **Show**: The createPinoConfig function showing development vs production configuration with serializers and formatting
- **Referenced in**: "What are the benefits of using nestjs-pino for logging?" section

## Screenshot 2: Custom Logger Service
- **Filename**: `image-1.png`
- **Location**: Save in `8-Authentication-Security-Logging/logging-error-handling-nestjs/`
- **What to capture**: Open `demo-project/nestjs/logging/custom-logger.service.ts` in VS Code
- **Show**: Business-specific logging methods like logUserAction, logApiRequest, logSecurityEvent, logJobProcessing
- **Referenced in**: "What are the benefits of using nestjs-pino for logging?" section

## Screenshot 3: HTTP Exception Filter
- **Filename**: `image-2.png`
- **Location**: Save in `8-Authentication-Security-Logging/logging-error-handling-nestjs/`
- **What to capture**: Open `demo-project/nestjs/filters/http-exception.filter.ts` in VS Code
- **Show**: The catch method and ErrorResponse interface showing standardized error formatting
- **Referenced in**: "How does global exception handling improve API consistency?" section

## Screenshot 4: All Exceptions Filter
- **Filename**: `image-3.png`
- **Location**: Save in `8-Authentication-Security-Logging/logging-error-handling-nestjs/`
- **What to capture**: Open `demo-project/nestjs/filters/all-exceptions.filter.ts` in VS Code
- **Show**: The catch method handling uncaught errors and the error handlers array
- **Referenced in**: "How does global exception handling improve API consistency?" section

## Screenshot 5: Logging Interceptor
- **Filename**: `image-4.png`
- **Location**: Save in `8-Authentication-Security-Logging/logging-error-handling-nestjs/`
- **What to capture**: Open `demo-project/nestjs/logging/logging.interceptor.ts` in VS Code
- **Show**: The intercept method with request/response logging and performance monitoring
- **Referenced in**: "What is the difference between a logging interceptor and an exception filter?" section

## Screenshot 6: Demo Logging Controller
- **Filename**: `image-5.png`
- **Location**: Save in `8-Authentication-Security-Logging/logging-error-handling-nestjs/`
- **What to capture**: Open `demo-project/nestjs/logging/demo-logging.controller.ts` in VS Code
- **Show**: Different endpoints demonstrating various types of errors and logging scenarios
- **Referenced in**: "What is the difference between a logging interceptor and an exception filter?" section

## Screenshot 7: Logging Module Configuration
- **Filename**: `image-6.png`
- **Location**: Save in `8-Authentication-Security-Logging/logging-error-handling-nestjs/`
- **What to capture**: Open `demo-project/nestjs/logging/logging.module.ts` in VS Code
- **Show**: LoggerModule.forRootAsync configuration with redaction, custom serializers, and pinoHttp options
- **Referenced in**: "How can logs be structured to provide useful debugging information?" section

## Screenshot 8: App Module with Global Filters
- **Filename**: `image-7.png`
- **Location**: Save in `8-Authentication-Security-Logging/logging-error-handling-nestjs/`
- **What to capture**: Open `demo-project/nestjs/app.module.ts` in VS Code
- **Show**: The providers section with APP_FILTER registrations for both exception filters
- **Referenced in**: "How can logs be structured to provide useful debugging information?" section

## Screenshot 9: Main.ts Logger Integration
- **Filename**: `image-8.png`
- **Location**: Save in `8-Authentication-Security-Logging/logging-error-handling-nestjs/`
- **What to capture**: Open `demo-project/main.ts` in VS Code
- **Show**: The bootstrap function with Pino logger integration using app.useLogger(app.get(Logger))
- **Referenced in**: "How can logs be structured to provide useful debugging information?" section