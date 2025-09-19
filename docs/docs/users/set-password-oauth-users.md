---
title: Set Password for OAuth Users
intro: Learn how users who signed up via Google OAuth can set a password to access the API with email/password authentication.
links:
  overview:
  quickstart:
  previous:
  next:
  guides:
  related:
  featured:
required_permissions:
  - "user:update"
---

## Overview

Users who sign up via OAuth providers (like Google, GitHub, etc.) don't initially have a password set in their Devopness account. This prevents them from using API endpoints that require email/password authentication, such as the `/users/login` endpoint.

This guide shows OAuth users how to set a password for their account, enabling API access with standard authentication credentials.

## Prerequisites

- An active Devopness account created via OAuth (Google, GitHub, etc.)
- A valid access token from your OAuth session

## Setting Your Password

### Step 1: Get Your Access Token

1. Log into the Devopness web application using your OAuth provider
2. Open your browser's Developer Tools (F12)
3. Go to the **Network** or **Application** tab
4. Look for the `Authorization` header in API requests, or find the access token in local storage
5. Copy the token value (it starts with `eyJ...`)

### Step 2: Set Your Password via API

Use the `POST /users/me/password` endpoint to set your password:

```bash
curl -X POST https://api.devopness.com/users/me/password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "password": "your-new-password",
    "password_confirmation": "your-new-password"
  }'
```

### Step 3: Verify Password is Set

Test your new password by logging in via the API:

```bash
curl -X POST https://api.devopness.com/users/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-new-password"
  }'
```

If successful, you'll receive a response with your access token:

```json
{
  "token_type": "Bearer",
  "expires_in": 3600,
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIs...",
  "refresh_token": "def502004a8c9c..."
}
```

## Using SDKs

### JavaScript/TypeScript

```typescript
import { DevopnessApiClient } from '@devopness/sdk-js';

const apiClient = new DevopnessApiClient();

// Set your password (requires existing OAuth token)
apiClient.setAccessToken('your-oauth-access-token');

await apiClient.users.passwords.updateUserMePassword({
  password: 'your-new-password',
  password_confirmation: 'your-new-password'
});

// Now login with email/password
const loginResponse = await apiClient.users.loginUser({
  email: 'your-email@example.com',
  password: 'your-new-password'
});

console.log('New access token:', loginResponse.data.access_token);
```

### Python

```python
from devopness import DevopnessClient
from devopness.models import UserPasswordUpdate, UserLogin

# Initialize client and set OAuth token
client = DevopnessClient()
client.access_token = 'your-oauth-access-token'

# Set your password
password_data = UserPasswordUpdate(
    password='your-new-password',
    password_confirmation='your-new-password'
)
client.users.passwords.update_user_me_password(password_data)

# Now login with email/password
login_data = UserLogin(
    email='your-email@example.com',
    password='your-new-password'
)
login_response = client.users.login_user(login_data)
print(f'New access token: {login_response.data.access_token}')
```

## Security Considerations

- **Strong Passwords**: Use a strong, unique password for your account
- **Token Security**: Keep your access tokens secure and never commit them to version control
- **Regular Rotation**: Consider rotating your API tokens regularly
- **Scope Limitation**: OAuth tokens may have different permissions than password-based tokens

## Troubleshooting

### Error: "Unauthenticated"

This means your OAuth access token is invalid or expired. Log back into the web application and get a fresh token.

### Error: "Validation failed"

Check that:
- `password` and `password_confirmation` match exactly
- Password meets minimum security requirements
- Request headers include proper `Content-Type` and `Accept`

### Error: "Forbidden"

Your current token may not have permission to update passwords. Ensure you're using a valid user token, not a project-scoped API token.

## Next Steps

- [Generate API Tokens](../api-tokens/personal-access-tokens/)
- [Find Your Activity Summary](./find-your-activity-summary.md)
- [API Authentication Guide](../api/)