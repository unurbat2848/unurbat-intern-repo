# Screenshot Instructions for Issue #17: Using Jest & Supertest for API Testing in NestJS

## Required Screenshots

### 1. Test Files Structure
**File**: VS Code file explorer
**Action**: Show the test directory with all created test files
**Location**: `Images/test-files-structure.png`

### 2. Running Security Integration Tests  
**File**: Terminal/Command Prompt
**Action**: Run `cd demo-project && npm test -- --testPathPatterns="security.e2e-spec.ts"`
**Location**: `Images/security-tests-running.png`
**Show**: Test results with all passing tests for GET endpoints

### 3. Security Test Results
**File**: Terminal/Command Prompt  
**Action**: Show the complete output of security tests passing
**Location**: `Images/security-tests-results.png`
**Show**: All 6 tests passed for security controller endpoints

### 4. Authentication Mocking Test
**File**: Terminal/Command Prompt
**Action**: Run `cd demo-project && npm test -- --testPathPatterns="auth-mock.e2e-spec.ts"`
**Location**: `Images/auth-mock-tests.png`
**Show**: JWT token creation and mocking authentication scenarios

### 5. Test Code Example - GET Endpoint
**File**: VS Code editor
**Action**: Show `test/security.e2e-spec.ts` file content
**Location**: `Images/get-endpoint-test-code.png` 
**Show**: Example of testing GET endpoint with assertions

### 6. Test Code Example - Authentication Mocking
**File**: VS Code editor  
**Action**: Show `test/auth-mock.e2e-spec.ts` file content
**Location**: `Images/auth-mock-test-code.png`
**Show**: JWT token creation and authentication header testing

### 7. Jest Configuration
**File**: VS Code editor
**Action**: Show `jest.config.js` with updated test regex
**Location**: `Images/jest-config.png`
**Show**: Configuration supporting both .spec.ts and .e2e-spec.ts files

### 8. Reflection Documentation
**File**: VS Code editor
**Action**: Show the completed `nestjs-api-tests.md` reflection file
**Location**: `Images/reflection-documentation.png`
**Show**: The comprehensive reflection answering all required questions

## Notes
- Screenshots should show successful test execution demonstrating Supertest integration with NestJS
- Include terminal output showing test results and coverage
- Show actual test code demonstrating API testing concepts learned
- Document the difference between unit tests (.spec.ts) and integration tests (.e2e-spec.ts)