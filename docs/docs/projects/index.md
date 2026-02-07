---
title: Projects
intro: Use projects to group and manage an unlimited number of infrastructure resources.
links:
    overview:
    quickstart:
    previous:
    next: projects/add-project
    guides:
    related:
    featured:
---

## When to use a new project

A project is a container for multiple environments and resources, such as servers, applications, SSL certificates, cronjobs, and more. It also holds teams, roles, and permissions.

Use a new project when:
- The applications belong to different products or different teams.
- The teams and permissions should be different.
- You want to use different credentials (for example Git credentials or cloud provider credentials).

Use the same project when:
- Multiple applications are part of the same product and are managed by the same teams.
- You want to manage environments, roles, permissions, and credentials once.

Examples:
- Same project: `www.my-product.ai`, `demo.my-product.ai`, and `agent-server` are parts of the same product and are managed by the same teams.
- Separate projects: `app-a` and `app-b` are different products with different teams or different credentials.

You can always add another project later if your needs change.
