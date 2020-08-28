# api-docs
Devopness API documentation

![CI](https://github.com/devopness/api-docs/workflows/CI/badge.svg)

Source code for [Devopness API documentation](https://api-docs.devopness.com)

## About Devopness
`Devopness` aims to drastically change the way software developers deploy applications and manage on-premise and cloud servers in a secure and performant fashion.

By streamlining essential DevOps practices we're making first class software deployment and server management tools accessible and affordable to every developer in the world.

## Usage

### Install dependencies
```
npm ci
```

### Generate docs
```
npm run build
```

### Generate docs and initialize a local server
```
npm run api-docs-serve
```

### Run tests
```
npm t
```

## Validation & testing
The API docs are validated and tested against a live backend using [dredd](https://dredd.org), plus custom hooks.
By running the `build` npm script, one should already go through the dredd validation and testing flow.
A comprehensive section on automated testing and troubleshooting tests is available in the `automated_testing.md` file.

## API naming conventions
The rules listed below use the *object* and *entity* terminology. The former represents data payloads sent between a client and the server; the latter describes an API concept. Multiple objects can refer to the same entity. Objects can represent entities partially or entirely.

- **URL path parameters referring to object IDs** need to be in the form `{entity_type}_id`. For instance, the URL path `/logs/deployments/{deployment_id}/steps/{deployment_step_id}` contains two id parameters: one for a "Deployment" entity and another for a "Deployment Step" entity.
- **Payload schema references** should have the `#/components/schemas/{ObjectType}` form. This applies for both request body parameters and response body values. For example: `#/components/schemas/DeploymentStep` refers to a `DeploymentStep` object, describing a "Deployment Step" entity.
- **Payload parameters to routes that create or update entities** have a suffix that indicates the operation made on the entity: either `-Create` or `-Update`. This is be observed in the "Project" entity: the `addProject` route has a `ProjectCreate` object as parameter, which includes only fields used when creating a server; the `updateProject` route takes a `ProjectUpdate` parameter, which only contains fields that can be updated by the user; the `getProject` route returns a `Project` object, which contains all the visible fields for a "Project" entity. Very often, those schemas can be reused through [OpenAPI schema inheritance](https://swagger.io/docs/specification/data-models/inheritance-and-polymorphism/).
- **The operationId of a route** should refer to what operation is being made on which entities. Some good examples are: the `linkServerToEnvironment` route links a "Server" to an "Environment"; the `addServerToProject` routes add a "Server" to a "Project"; the `addProject` route creates a "Project".
