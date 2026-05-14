---
"@devopness/sdk-python": minor
---

Credentials now live at the organization level instead of being tied to individual environments. This means you can create a credential once and reuse it across multiple environments - perfect for managing the same AWS account across dev, staging, and production environments without duplicating credential configurations.

## ⚠️ Breaking Changes

### The `add_environment_credential()` method has been removed

You can no longer create credentials directly within an environment. Instead, you create them at the organization level and link them to environments.

## New Features

### Organization-level credential management

**List all credentials in your organization:**
```python
credentials = devopness.credentials.list_organization_credentials(organization_id)
```

**Create a credential at organization level:**
```python
credential = devopness.credentials.add_organization_credential(organization_id, {
    "name": "My Cloud Provider",
    "provider_code": "aws",  # or 'azure', 'gcp', 'digitalocean', etc.
    "settings": {
        # Provider-specific configuration
    }
})
```

### Environment credential linking

**Link a credential to an environment:**
```python
devopness.credentials.link_credential_to_environment(environment_id, credential_id, {})
```

**Unlink a credential from an environment:**
```python
devopness.credentials.unlink_credential_from_environment(environment_id, credential_id)
```

## What Stays the Same?

- **Listing environment credentials** - `list_environment_credentials()` still works
- **Getting credential details** - `get_credential()` unchanged
- **Updating credentials** - `update_credential()` unchanged
- **Deleting credentials** - `delete_credential()` unchanged
- **Credential settings and configuration** - All the same credential types and settings are supported