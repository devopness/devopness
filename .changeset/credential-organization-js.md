---
"@devopness/sdk-js": minor
---

Credentials now live at the organization level instead of being tied to individual environments. This means you can create a credential once and reuse it across multiple environments.

## ⚠️ Breaking Changes

### The `addEnvironmentCredential()` method has been removed

You can no longer create credentials directly within an environment. Instead, you create them at the organization level and link them to environments.

## New Features

### Organization-level credential management

**List all credentials in your organization:**
```javascript
const credentials = await devopness.credentials.listOrganizationCredentials(organizationId);
```

**Create a credential at organization level:**
```javascript
const credential = await devopness.credentials.addOrganizationCredential(organizationId, {
  name: 'My Cloud Provider',
  provider_code: 'aws', // or 'azure', 'gcp', 'digitalocean', etc.
  settings: {
    // Provider-specific configuration
  }
});
```

### Environment credential linking

**Link a credential to an environment:**
```javascript
await devopness.credentials.linkCredentialToEnvironment(environmentId, credentialId, {});
```

**Unlink a credential from an environment:**
```javascript
await devopness.credentials.unlinkCredentialFromEnvironment(environmentId, credentialId);
```

## What Stays the Same?

- **Listing environment credentials** - `listEnvironmentCredentials()` still works
- **Getting credential details** - `getCredential()` unchanged
- **Updating credentials** - `updateCredential()` unchanged
- **Deleting credentials** - `deleteCredential()` unchanged
- **Credential settings and configuration** - All the same credential types and settings are supported