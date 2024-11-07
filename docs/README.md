# Devopness documentation
Devopness maintains its documentation in an open source repository, so feel free to contribute to this project!

# Contribution guidelines
Make sure all files created in this folder adhere to the following basic rules:
1. Are defined as `Markdown` files (.md)
2. Use front matter headers, see the list of available headers in [this topic](#predefined-variables)
3. **DO NOT** set heading level one (a single `#` in `Markdown` content), as it is reserved for the documentation article title. Headings inside the documentation article content must start from heading level two (`##`). Please refer to [Markdown basic syntax](https://www.markdownguide.org/basic-syntax/#headings) for examples and detailed instructions
4. **DO NOT** use `HTML` tags in `Markdown` content

# Documentation authoring guidelines
## What to document?
We should document use cases that will help our users successfully achieve their goals while using Devopness platform.

## How to document?
1. Adopt a **Step by step** approach, making it super easy for readers to follow along:
    - Each step should be clear, with a short sentence.
    - If a process is long, break it down into multiple small steps.
    - That will help the reader to understand each step without pressure, then breath, then move on to the next step.
2. **Be brief**: Use short sentences and paragraphs
    - Stick to the principle of one main idea per sentence, plus one additional point if needed.
    - Each paragraph should address one main idea.
    - Remember the basic structure of a paragraph is: Introduction, body, and conclusion.
3. Use **Simple English**. Use **simple words**
    - Use simple words to increase reader comprehension and reduce ambiguity
    - Follow these tips for making good word choices:
      - Avoid jargon: Write for your audience, using everyday language where possible, and technical terms where appropriate.
      - Avoid clichés, idioms, and metaphors.
      - **Be consistent**: Use one term for each concept and use it consistently along the documentation.
      - Avoid “fancy” words and phrases: If there is a simpler word or phrase, use it.
      - Keep documentation simple and accessible to everyone, as Devopness itself. ;-)

## What should NOT be included in the documentation?
1. Do not go too deep into business rules that are already validated and communicated by the API as Devopness product is built with an API-first approach. We strive for keeping API responses and validation messages easily understood by machines and humans alike, there's no need to repeat ourselves in the docs explaining which field values are valid or not.
It is Devopness API responsibility to communicate the validation rules to the end users in a clear way, so that should not require extra documentation to explain API messages.
* We might, however, want to produce `Overview` or `Deep dive` articles to conceptually give users detailed explanation on specific topics that fall beyond the more common use-case-based step by step.

## Predefined variables
Here is a list of predefined variables that can be set in the `front-matter` block of a documentation topic:

| Variable               | Description                                              | Required       |
|------------------------|----------------------------------------------------------|----------------|
| `title`                | The title of the documentation topic                     | Yes            |
| `intro`                | A short paragraph introducing the topic                  | No             |
| `required_permissions` | List of Role permissions required to follow the post [1] | No             |

[1] For expected format, see section [Permissions](#permissions)

## Permissions

List of Role permissions, refer to this documentation when adding `required_permissions` field on frontmatter

the following documentation was generated from Static Permissions Data, using the following commands

```bash
node generate_permissions_docs.mjs 2>/dev/null >> README.md
```

```ts
// generate_permissions_docs.mjs

import staticPermissions from './response.json' assert { type: "json" };

for(const resourceType of staticPermissions){
  console.log(`
### ${resourceType.human_readable}`)

  for(const permission of resourceType.permissions){
    console.log(`
#### ${resourceType.human_readable} ${permission.human_readable}

${permission.hint}

permission: `${resourceType.resource_type}:${permission.name}`
`)
  }
}
```

### Application

#### Application Add

Allow to create new applications

permission: `application:create`


#### Application View

Allow to see applications

permission: `application:read`


#### Application Edit

Allow to modify existing applications

permission: `application:update`


#### Application Remove

Allow to delete/remove applications

permission: `application:delete`


#### Application Deploy

Allow to deploy applications on servers

permission: `application:deploy`


#### Application Custom pipeline

Allow to run custom pipelines for this resource type

permission: `application:custom`


#### Application Pipeline change step user

Allow team members to change the user account under which the pipeline step runs

permission: `application:pipeline_change_step_user`


### Credential

#### Credential Add

Allow to create new credentials

permission: `credential:create`


#### Credential View

Allow to see credentials

permission: `credential:read`


#### Credential Edit

Allow to modify existing credentials

permission: `credential:update`


#### Credential Remove

Allow to delete/remove credentials

permission: `credential:delete`


#### Credential Get status

Allow to get status of credentials

permission: `credential:get_status`


#### Credential Custom pipeline

Allow to run custom pipelines for this resource type

permission: `credential:custom`


### Cron Job

#### Cron Job Add

Allow to create new cron jobs

permission: `cronjob:create`


#### Cron Job View

Allow to see cron jobs

permission: `cronjob:read`


#### Cron Job Edit

Allow to modify existing cron jobs

permission: `cronjob:update`


#### Cron Job Remove

Allow to delete/remove cron jobs

permission: `cronjob:delete`


#### Cron Job Deploy

Allow to deploy cron jobs on servers

permission: `cronjob:deploy`


#### Cron Job Custom pipeline

Allow to run custom pipelines for this resource type

permission: `cronjob:custom`


#### Cron Job Pipeline change step user

Allow team members to change the user account under which the pipeline step runs

permission: `cronjob:pipeline_change_step_user`


### Daemon

#### Daemon Add

Allow to create new daemons

permission: `daemon:create`


#### Daemon View

Allow to see daemons

permission: `daemon:read`


#### Daemon Edit

Allow to modify existing daemons

permission: `daemon:update`


#### Daemon Remove

Allow to delete/remove daemons

permission: `daemon:delete`


#### Daemon Restart

Allow to restart daemons

permission: `daemon:restart`


#### Daemon Start

Allow to start daemons

permission: `daemon:start`


#### Daemon Stop

Allow to stop daemons

permission: `daemon:stop`


#### Daemon Deploy

Allow to deploy daemons on servers

permission: `daemon:deploy`


#### Daemon Custom pipeline

Allow to run custom pipelines for this resource type

permission: `daemon:custom`


#### Daemon Get status

Allow to get status of daemons

permission: `daemon:get_status`


#### Daemon Pipeline change step user

Allow team members to change the user account under which the pipeline step runs

permission: `daemon:pipeline_change_step_user`


### Hook

#### Hook Add

Allow to create new hooks

permission: `hook:create`


#### Hook View

Allow to see hooks

permission: `hook:read`


#### Hook Edit

Allow to modify existing hooks

permission: `hook:update`


#### Hook Remove

Allow to delete/remove hooks

permission: `hook:delete`


### Network

#### Network Add

Allow to create new networks

permission: `network:create`


#### Network Get Status

Allow to get status of the networks

permission: `network:get_status`


#### Network View

Allow to see networks

permission: `network:read`


#### Network Edit

Allow to modify existing networks

permission: `network:update`


#### Network Remove

Allow to delete/remove networks

permission: `network:delete`


#### Network Provision

Allow to provision networks

permission: `network:provision`


### Network Rule

#### Network Rule Add

Allow to create new network rules

permission: `network-rule:create`


#### Network Rule View

Allow to see network rules

permission: `network-rule:read`


#### Network Rule Edit

Allow to modify existing network rules

permission: `network-rule:update`


#### Network Rule Remove

Allow to delete/remove network rules

permission: `network-rule:delete`


#### Network Rule Deploy

Allow to deploy network rules on servers

permission: `network-rule:deploy`


#### Network Rule Custom pipeline

Allow to run custom pipelines for this resource type

permission: `network-rule:custom`


#### Network Rule Pipeline change step user

Allow team members to change the user account under which the pipeline step runs

permission: `network-rule:pipeline_change_step_user`


### Server

#### Server Add

Allow to create new servers

permission: `server:create`


#### Server View

Allow to see servers

permission: `server:read`


#### Server Edit

Allow to modify existing servers

permission: `server:update`


#### Server Remove

Allow to delete/remove servers

permission: `server:delete`


#### Server Get status

Allow to get status of the servers

permission: `server:get_status`


#### Server Restart

Allow to restart servers

permission: `server:restart`


#### Server Start

Allow to start servers

permission: `server:start`


#### Server Stop

Allow to stop servers

permission: `server:stop`


#### Server Deploy

Allow to deploy servers

permission: `server:deploy`


#### Server Provision

Allow to provision servers on cloud providers

permission: `server:provision`


#### Server Check provisioned

Allow to check if server has been provisioned

permission: `server:check_provisioned`


#### Server Custom pipeline

Allow to run custom pipelines for this resource type

permission: `server:custom`


#### Server Pipeline change step user

Allow team members to change the user account under which the pipeline step runs

permission: `server:pipeline_change_step_user`


### Service

#### Service Add

Allow to create new services

permission: `service:create`


#### Service View

Allow to see services

permission: `service:read`


#### Service Edit

Allow to modify existing services

permission: `service:update`


#### Service Remove

Allow to delete/remove services

permission: `service:delete`


#### Service Reload

Allow to reload services

permission: `service:reload`


#### Service Restart

Allow to restart services

permission: `service:restart`


#### Service Start

Allow to start services

permission: `service:start`


#### Service Stop

Allow to stop services

permission: `service:stop`


#### Service Get status

Allow to get status of the services

permission: `service:get_status`


#### Service Deploy

Allow to deploy services on servers

permission: `service:deploy`


#### Service Custom pipeline

Allow to run custom pipelines for this resource type

permission: `service:custom`


#### Service Pipeline change step user

Allow team members to change the user account under which the pipeline step runs

permission: `service:pipeline_change_step_user`


### SSH Keys

#### SSH Keys Add

Allow to create new SSH keys

permission: `ssh-key:create`


#### SSH Keys View

Allow to see SSH keys

permission: `ssh-key:read`


#### SSH Keys Edit

Allow to modify existing SSH keys

permission: `ssh-key:update`


#### SSH Keys Remove

Allow to delete/remove SSH keys

permission: `ssh-key:delete`


#### SSH Keys Deploy

Allow to deploy SSH keys on servers

permission: `ssh-key:deploy`


#### SSH Keys Custom pipeline

Allow to run custom pipelines for this resource type

permission: `ssh-key:custom`


#### SSH Keys Pipeline change step user

Allow team members to change the user account under which the pipeline step runs

permission: `ssh-key:pipeline_change_step_user`


### SSL certificate

#### SSL certificate View

Allow to see SSL certificates

permission: `ssl-certificate:read`


#### SSL certificate Add

Allow to create new SSL certificate

permission: `ssl-certificate:create`


#### SSL certificate Edit

Allow to modify existing SSL certificate

permission: `ssl-certificate:update`


#### SSL certificate Remove

Allow to delete/remove SSL certificate

permission: `ssl-certificate:delete`


#### SSL certificate Deploy

Allow to deploy SSL certificate on servers

permission: `ssl-certificate:deploy`


### Virtual Host

#### Virtual Host Add

Allow to create new Virtual Host

permission: `virtual-host:create`


#### Virtual Host View

Allow to see Virtual Hosts

permission: `virtual-host:read`


#### Virtual Host Edit

Allow to modify existing Virtual Host

permission: `virtual-host:update`


#### Virtual Host Remove

Allow to delete/remove Virtual Host

permission: `virtual-host:delete`


#### Virtual Host Deploy

Allow to deploy Virtual Host on servers

permission: `virtual-host:deploy`


#### Virtual Host Custom pipeline

Allow to run custom pipelines for this resource type

permission: `virtual-host:custom`


#### Virtual Host Get status

Allow to get status of the Virtual Host

permission: `virtual-host:get_status`

