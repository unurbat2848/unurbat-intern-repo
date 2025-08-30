# Security Best Practices for Environment Variables

This document outlines security best practices for managing environment variables and secrets in our NestJS application.

## 🔒 Never Commit These to Version Control

### ❌ Secrets and Sensitive Data
- **Database passwords**: `DB_PASSWORD=secretpassword123`
- **JWT secrets**: `JWT_SECRET=your-super-secret-jwt-key`
- **API keys**: `OPENAI_API_KEY=sk-1234567890abcdef`
- **OAuth client secrets**: `AUTH0_CLIENT_SECRET=abcd1234`
- **Webhook URLs with tokens**: `SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`
- **Encryption keys**: `ENCRYPTION_KEY=32-byte-hex-key`
- **Session secrets**: `SESSION_SECRET=random-session-key`

### ❌ Environment-Specific Configuration
- `.env` files containing real credentials
- Private keys (`.pem`, `.key` files)
- Configuration files with embedded secrets

## ✅ Safe to Version Control

### ✅ Public Configuration
- **Application name**: `APP_NAME=Focus Bear API`
- **API version**: `API_VERSION=v1`
- **Default ports**: `PORT=3000`
- **Environment names**: `NODE_ENV=development`
- **Public URLs**: `API_BASE_URL=https://api.focusbear.app`

### ✅ Template Files
- `.env.example` with dummy values
- Configuration templates
- Public keys (for verification only)

## 🛡️ Security Measures Implemented

### 1. .gitignore Protection
```gitignore
# Environment variables (CRITICAL FOR SECURITY)
.env
.env.local
.env.development
.env.staging
.env.production
.env.test
```

### 2. Environment Variable Validation
- **Joi Schema Validation**: Ensures all required variables are present
- **Type Validation**: Converts and validates data types
- **Format Validation**: Validates URLs, email formats, etc.
- **Required vs Optional**: Distinguishes between critical and optional variables

### 3. Configuration Structure
```typescript
// ✅ Good: Environment-aware defaults
const config = {
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-for-development-only',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  }
};

// ❌ Bad: Hardcoded secrets
const config = {
  jwt: {
    secret: 'hardcoded-secret-key-123', // Never do this!
  }
};
```

### 4. Runtime Validation
- Application fails to start if critical variables are missing
- Clear error messages for missing configuration
- Type conversion with fallbacks for non-critical values

## 🚀 Deployment Security

### Development Environment
```bash
# .env (not committed)
NODE_ENV=development
JWT_SECRET=dev-secret-change-in-production
DB_PASSWORD=dev-password-123
```

### Staging Environment
```bash
# Set via CI/CD or cloud provider
NODE_ENV=staging
JWT_SECRET=staging-secret-32-chars-minimum
DB_PASSWORD=complex-staging-password
```

### Production Environment
```bash
# Set via secure environment variable injection
NODE_ENV=production
JWT_SECRET=production-secret-with-high-entropy
DB_PASSWORD=highly-secure-production-password
OPENAI_API_KEY=sk-production-key-with-proper-scopes
```

## 🔍 How to Check for Leaked Secrets

### 1. Git History Scan
```bash
# Search for potential secrets in git history
git log --all --full-history --grep="password\|secret\|key"
git log --all --full-history -S "password=" -- "*.js" "*.ts" "*.json"
```

### 2. Pre-commit Hooks
- Use tools like `git-secrets` or `detect-secrets`
- Scan for common secret patterns before commits
- Block commits containing potential secrets

### 3. Code Review Checklist
- [ ] No hardcoded passwords or API keys
- [ ] Environment variables used for all sensitive data
- [ ] .env files added to .gitignore
- [ ] No secrets in configuration objects
- [ ] Proper validation for required variables

## 🎯 Focus Bear Specific Security

### Production Secrets Management
- Use cloud provider secret managers (AWS Secrets Manager, Azure Key Vault)
- Rotate secrets regularly (especially API keys)
- Monitor for unauthorized access attempts
- Implement least-privilege access to secrets

### API Key Security
```typescript
// ✅ Good: Proper API key usage
const openaiKey = this.configService.get<string>('externalApis.openai.apiKey');
if (!openaiKey) {
  throw new Error('OpenAI API key is required in production');
}

// ❌ Bad: Exposing keys in logs or responses
console.log('Using API key:', openaiKey); // Never log secrets!
return { apiKey: openaiKey }; // Never return secrets in API responses!
```

### Database Security
- Never log database credentials
- Use connection pooling with proper limits
- Enable SSL in production
- Implement proper access controls

## 📋 Security Checklist

Before deploying to production:

- [ ] All `.env` files are in `.gitignore`
- [ ] No secrets hardcoded in source code
- [ ] Environment validation passes for all environments
- [ ] Secrets are managed via secure systems (not plain text files)
- [ ] API keys have appropriate scopes/permissions
- [ ] Database connections use SSL in production
- [ ] Session secrets are sufficiently random and long
- [ ] JWT secrets meet minimum entropy requirements
- [ ] All third-party service credentials are valid and active

## 🚨 What to Do If Secrets Are Exposed

1. **Immediately rotate/revoke** the exposed credentials
2. **Check git history** for how long the secret was exposed
3. **Audit access logs** for potential unauthorized usage
4. **Update all systems** using the old credentials
5. **Review and improve** security practices to prevent recurrence

Remember: **Security is everyone's responsibility!**