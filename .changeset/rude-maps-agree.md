---
"@devopness/sdk-js": patch
"@devopness/sdk-python": patch
---

Add support for filtering linked resources by type in `GET /resource-links/{resource_type}/{resource_id}/{link_type}` endpoint.

> When listing resources linked to a base resource (either parent or child relationships), you can now filter the results to return
> only linked resources of a specific type using the new `linkedResourceType` query parameter.
