# Screenshots Required for Issue 36

## Screenshots to Take:

### 1. Middleware Implementation
- Screenshot of `request-id.middleware.ts` showing unique ID generation
- Screenshot of `security.middleware.ts` showing security headers
- Screenshot of `app.module.ts` showing middleware configuration

### 2. Interceptor Implementation  
- Screenshot of `logging.interceptor.ts` showing request/response logging
- Screenshot of `response-transform.interceptor.ts` showing response wrapping
- Screenshot of `error-handling.interceptor.ts` showing error catching
- Screenshot of `cache.interceptor.ts` showing caching logic

### 3. Global Configuration
- Screenshot of `main.ts` showing global interceptors setup with proper order
- Screenshot of `products.controller.ts` showing method-specific interceptor usage

### 4. Testing Results
- Screenshot of curl command with -v flag showing security headers in response
- Screenshot of server logs showing middleware and interceptor execution
- Screenshot of cache HIT/MISS behavior in logs
- Screenshot of error handling logs when accessing non-existent resource

### 5. Response Transformation
- Screenshot of API response showing transformed format with metadata
- Screenshot comparing original vs transformed response structure

## Files Created/Modified for Issue 36:

### Middleware Files:
- `demo-project/nestjs/middleware/request-id.middleware.ts` - Request ID generation
- `demo-project/nestjs/middleware/security.middleware.ts` - Security headers

### Interceptor Files:
- `demo-project/nestjs/interceptors/logging.interceptor.ts` - Request/response logging
- `demo-project/nestjs/interceptors/response-transform.interceptor.ts` - Response transformation
- `demo-project/nestjs/interceptors/error-handling.interceptor.ts` - Error handling
- `demo-project/nestjs/interceptors/cache.interceptor.ts` - Request caching

### Configuration Files:
- `demo-project/nestjs/app.module.ts` - Middleware configuration
- `demo-project/main.ts` - Global interceptors setup
- `demo-project/nestjs/products/products.controller.ts` - Method-specific interceptor

### Documentation:
- `7-building-APIs/using-interceptors-middleware-nestjs/nestjs-interceptors-middleware.md` - Reflection
- `7-building-APIs/using-interceptors-middleware-nestjs/test-results.txt` - Test results

## Test Commands Used:
```bash
# Test middleware and basic interceptors
curl -v -X GET http://localhost:3002/api/products

# Test cache interceptor (run twice quickly)
curl -X GET http://localhost:3002/api/products
curl -X GET http://localhost:3002/api/products

# Test request body logging
curl -X POST http://localhost:3002/api/products -H "Content-Type: application/json" -d '{"name":"Test Interceptors","price":99.99,"description":"Testing middleware and interceptors"}'

# Test error handling
curl -X GET http://localhost:3002/api/products/999
```

## Key Features Demonstrated:
- Middleware execution order and request preprocessing
- Global vs method-specific interceptor application  
- Response transformation and metadata addition
- Request/response logging with timing information
- Error catching and logging with request correlation
- Caching mechanism with expiration
- Security headers and request ID generation