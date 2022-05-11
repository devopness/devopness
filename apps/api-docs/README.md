# Devopness API Documentation

![CI](https://github.com/devopness/api-docs/workflows/CI/badge.svg)

This is the source code for [Devopness API Documentation](https://api-docs.devopness.com)

In this file we keep internal documentation for API development team and contributors.
For public API documentation, please visit:
https://staging-api-docs.devopness.com/#tag/API-Reference

## About Devopness
`Devopness` aims to drastically change the way people manage applications and cloud infrastructure, in a secure and performant fashion.

By streamlining essential DevOps practices, we're making first-class software deployment and cloud infrastructure management tools accessible and affordable to every person in the world.

# Architecture Design goals:
## Be a consistent API and easy to integrate with
Every developer in the world, by just following instructions on this API documentation, should be able to integrate with Devopness API.

## Standardized
Each endpoint documented here must have a consistent operation name defined by its `operationId`.
The operation name must be aligned with the endpoint HTTP method.
For more details and reference see the existing [endpoints specs](docs/spec).

# Usage

## Build and run
### Install dependencies
```shell
npm ci
```

### Generate docs
```shell
npm run build
```

### Generate docs and initialize a local server
```shell
npm run api-docs-serve
```

### Run tests
```shell
npm run api-test
```

## Add documentation for an API endpoint
1. In [./docs/spec/endpoints](./docs/spec/endpoints) add a directory to the new REST API resource, ensuring each resource/entity will adhere the following directory structure:

```md
- docs
  - spec
    - endpoints
      - <resource>
        - paths
        - schemas
```

2. In the `/paths` subdirectory, add the new operation's `yaml` file, with its name mirroring the operation.
    - In the operation's file, set the `summary`, `operationId`, `tags`, `parameters`, `responses` and, if needed, `requestBody` fields.
3. In the `/schemas` subdirectory, add the new object's `yaml` file with the fields `type`, `properties` and `required`.
    - If the operation returns a list, also add a file for it with the fields `type` and `items`.
4. In `/docs/spec/data-models.yaml`, add the reference to the new object and, if needed, the return list.
5. In `/docs/spec/paths.yaml`, add the endpoint's path and the reference to the new operation.
6. In `/docs/spec/api-docs.yaml`, add the new endpoint's tag to the alphabetical list in `tags`.

## Validation & testing
The API docs are validated and tested against a live back end using [dredd](https://dredd.org) and a few custom hooks.
By running the `build` npm script, one should already go through the dredd validation and testing flow.
A comprehensive section on automated testing and troubleshooting tests is available in the `automated_testing.md` file.

## API naming conventions
The rules listed below use the *object* and *entity* terminology. The former represents data payloads sent between a client and the server; the latter describes an API concept. Multiple objects can refer to the same entity. Objects can represent entities partially or entirely.

- **URL path parameters referring to object IDs** need to be in the form `{entity_type}_id`. For instance, the URL path `/logs/deployments/{deployment_id}/steps/{deployment_step_id}` contains two id parameters: one for a "Deployment" entity and another for a "Deployment Step" entity.
- **Payload schema references** should have the `#/components/schemas/{ObjectType}` form. This applies for both request body parameters and response body values. For example: `#/components/schemas/DeploymentStep` refers to a `DeploymentStep` object, describing a "Deployment Step" entity.
- **Payload parameters to routes that create or update entities** have a suffix that indicates the operation made on the entity: either `-Create` or `-Update`. This can be observed in the "Project" entity: the `addProject` route has a `ProjectCreate` object as parameter, which includes only fields used when creating a server; the `updateProject` route takes a `ProjectUpdate` parameter, which only contains fields that can be updated by the user; the `getProject` route returns a `Project` object, which contains all the visible fields for a "Project" entity. Very often, those schemas can be reused through [OpenAPI schema inheritance](https://swagger.io/docs/specification/data-models/inheritance-and-polymorphism/).
- **The operationId of a route** should refer to what operation is being made on which entities. Some good examples are: the `linkServerToEnvironment` route links a "Server" to an "Environment"; the `addServerToProject` routes add a "Server" to a "Project"; the `addProject` route creates a "Project".
