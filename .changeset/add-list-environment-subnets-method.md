---
"@devopness/sdk-js": patch
"@devopness/sdk-python": patch
---

- Added a method to list all subnets belonging to an environment:

    **JavaScript/TypeScript:**

    ```javascript
    devopness.subnets.listEnvironmentSubnets(environmentId);
    ```

    **Python:**

    ```python
    devopness.subnets.list_environment_subnets(environment_id)
    ```
