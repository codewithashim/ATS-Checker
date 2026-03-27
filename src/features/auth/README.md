# Enhanced Authentication System

This authentication system provides comprehensive edge case handling, security features, and user experience optimizations for signup, signin, and session management.

## Features

### 🔐 Comprehensive Error Handling
- **Network Errors**: Automatic retry with exponential backoff
- **Rate Limiting**: Protection against brute force attacks
- **Token Management**: Automatic refresh and expiration handling
- **Validation**: Client-side and server-side validation with detailed error messages
- **Session Management**: Secure session handling with activity monitoring

### 🛡️ Security Features
- **Password Strength**: Comprehensive password validation
- **Input Sanitization**: Protection against XSS and injection attacks
- **Rate Limiting**: Prevents abuse and brute force attacks
- **Session Security**: Automatic session timeout and concurrent login detection
- **Token Security**: Secure token storage and automatic refresh

### 🎯 User Experience
- **Real-time Validation**: Immediate feedback on form inputs
- **Loading States**: Clear indication of processing status
- **Error Recovery**: Automatic retry for recoverable errors
- **Session Persistence**: Remember user sessions across browser sessions
- **Activity Monitoring**: Automatic session extension based on user activity

## Architecture

### Core Components

#### 1. AuthError Class (`services/auth-api.ts`)
Enhanced error handling with:
- Error codes and types
- Retry logic indicators
- Detailed error information
- Status code mapping

#### 2. AuthAPI Class (`services/auth-api.ts`)
Comprehensive API client with:
- Automatic retry logic
- Token refresh handling
- Rate limiting protection
- Network error recovery

#### 3. SessionManager (`utils/session-manager.ts`)
Advanced session management:
- Activity monitoring
- Automatic session refresh
- Concurrent login detection
- Session timeout handling

#### 4. AuthErrorHandler (`utils/error-handler.ts`)
User-friendly error display:
- Contextual error messages
- Retry suggestions
- Action buttons
- Error logging

#### 5. Enhanced Validation (`utils/validation.ts`)
Comprehensive input validation:
- Email format validation
- Password strength checking
- Input sanitization
- Security pattern detection

## Error Handling

### Error Types

#### Network Errors
- `NETWORK_ERROR`: Connection issues
- `TIMEOUT_ERROR`: Request timeout
- `CONNECTION_ERROR`: Server unreachable

#### Authentication Errors
- `INVALID_CREDENTIALS`: Wrong email/password
- `ACCOUNT_LOCKED`: Too many failed attempts
- `ACCOUNT_DISABLED`: Account deactivated
- `ACCOUNT_NOT_VERIFIED`: Email not verified
- `TOKEN_EXPIRED`: Session expired
- `TOKEN_INVALID`: Invalid token

#### Registration Errors
- `EMAIL_ALREADY_EXISTS`: Duplicate email
- `WEAK_PASSWORD`: Password too weak
- `TERMS_NOT_ACCEPTED`: Terms not accepted

#### Rate Limiting
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `TOO_MANY_ATTEMPTS`: Too many failed attempts
- `BRUTE_FORCE_DETECTED`: Suspicious activity

### Error Recovery

#### Automatic Retry
- Network errors are automatically retried with exponential backoff
- Rate limit errors include retry delay information
- Token refresh is attempted automatically

#### User Actions
- Clear error messages when user starts typing
- Retry buttons for recoverable errors
- Contact support options for critical errors

## Validation

### Email Validation
- RFC-compliant email format checking
- Length validation (max 254 characters)
- Suspicious pattern detection
- XSS protection

### Password Validation
- Minimum 8 characters, maximum 128
- Character requirements (uppercase, lowercase, numbers, special chars)
- Common password detection
- Keyboard pattern detection
- Sequential character protection

### Name Validation
- Length validation (2-50 characters)
- Character restrictions (letters, spaces, hyphens, apostrophes)
- Multiple space protection
- Special character limits

### Security Validation
- HTML tag detection
- Script injection prevention
- Input sanitization
- XSS protection

## Session Management

### Session Lifecycle
1. **Creation**: On successful login/signup
2. **Monitoring**: Activity tracking every minute
3. **Refresh**: Automatic token refresh before expiry
4. **Timeout**: Session expires after 2 hours of inactivity
5. **Cleanup**: Automatic cleanup on logout or expiry

### Activity Monitoring
- Mouse movements and clicks
- Keyboard input
- Scroll events
- Touch events
- Page visibility changes

### Concurrent Login Detection
- Session ID tracking
- Device information logging
- Automatic logout on new login
- User notification system

## Usage Examples

### Basic Authentication

```typescript
import { useAuth } from '@/features/auth';

function LoginComponent() {
  const { signIn, signUp, signOut, user, isLoading, error } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      // User is automatically logged in
    } catch (error) {
      // Error is automatically handled and displayed
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {isLoading && <div>Loading...</div>}
      {/* Your form components */}
    </div>
  );
}
```

### Error Handling

```typescript
import { AuthErrorHandler } from '@/features/auth/utils/error-handler';

function handleAuthError(error: AuthError) {
  const errorInfo = AuthErrorHandler.getErrorDisplayInfo(error);
  
  if (errorInfo.retryable) {
    // Show retry button
  }
  
  if (errorInfo.action) {
    // Show action button
  }
}
```

### Session Management

```typescript
import { SessionManager } from '@/features/auth/utils/session-manager';

// Check if user has active session
const session = SessionManager.getSession();
if (session && !SessionManager.isSessionExpired(session)) {
  // User is logged in
}

// Create new session
const sessionInfo = await SessionManager.createSession(user);
```

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Session Configuration
```typescript
// In session-manager.ts
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const MAX_IDLE_TIME = 2 * 60 * 60 * 1000; // 2 hours
const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes
```

### Rate Limiting
```typescript
// In auth-api.ts
const retryAttempts = 3;
const retryDelay = 1000; // 1 second
const timeout = 30000; // 30 seconds
```

## Security Considerations

### Client-Side Security
- Input sanitization and validation
- XSS protection
- CSRF token handling
- Secure token storage

### Server-Side Security
- Rate limiting implementation
- Brute force protection
- Account lockout policies
- Secure password hashing

### Session Security
- Automatic session timeout
- Concurrent login detection
- Device fingerprinting
- Activity monitoring

## Testing

### Unit Tests
- Error handling scenarios
- Validation functions
- Session management
- API client methods

### Integration Tests
- Complete authentication flows
- Error recovery paths
- Session lifecycle
- Concurrent login scenarios

### Security Tests
- XSS prevention
- Injection attack prevention
- Rate limiting effectiveness
- Session security

## Monitoring and Logging

### Error Logging
- Structured error logging
- Context information
- User agent tracking
- Timestamp recording

### Performance Monitoring
- API response times
- Retry attempt tracking
- Session duration metrics
- Error rate monitoring

### Security Monitoring
- Failed login attempts
- Suspicious activity detection
- Rate limit violations
- Concurrent login alerts

## Best Practices

### Error Handling
1. Always provide user-friendly error messages
2. Implement proper retry logic for recoverable errors
3. Log errors with sufficient context
4. Handle edge cases gracefully

### Security
1. Validate all inputs on both client and server
2. Implement proper rate limiting
3. Use secure token storage
4. Monitor for suspicious activity

### User Experience
1. Provide clear feedback for all actions
2. Implement proper loading states
3. Handle network issues gracefully
4. Maintain session state appropriately

## Troubleshooting

### Common Issues

#### Session Expired
- Check if user is inactive for too long
- Verify token refresh is working
- Check network connectivity

#### Rate Limiting
- Wait for rate limit to reset
- Check for multiple login attempts
- Verify IP address restrictions

#### Network Errors
- Check internet connectivity
- Verify server availability
- Check firewall settings

#### Validation Errors
- Check input format requirements
- Verify password strength
- Check for special characters

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` to see detailed error information in the console.

## Contributing

When adding new features or fixing bugs:

1. Follow the existing error handling patterns
2. Add comprehensive validation
3. Include proper error messages
4. Update tests accordingly
5. Document any new configuration options

## License

This authentication system is part of the ATS Checkers Pro project and follows the same licensing terms.
