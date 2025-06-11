from typing import Any, List, Literal

from mcp.server.fastmcp import Context, FastMCP

from devopness.models import (
    Action,
    ActionPipelineCreatePlain,
    Application,
    ApplicationEnvironmentCreate,
    ApplicationRelation,
    CredentialRelation,
    EnvironmentRelation,
    Hook,
    HookPipelineCreate,
    HookTypeParam,
    PipelineRelation,
    ProjectRelation,
    Server,
    ServerEnvironmentCreate,
    ServerRelation,
    Service,
    ServiceRelation,
    ServiceType,
    SourceTypePlain,
    SshKey,
    UserMe,
)

from .devopness_api import devopness, ensure_authenticated
from .response import MCPResponse


def register_tools(mcp_server: FastMCP) -> None:
    """
    Register all Devopness tools that will be made available for the MCP server.
    """

    mcp_server.add_tool(devopness_get_user_profile)
    mcp_server.add_tool(devopness_list_application_pipelines)
    mcp_server.add_tool(devopness_list_applications)
    mcp_server.add_tool(devopness_list_credentials)
    mcp_server.add_tool(devopness_list_environments)
    mcp_server.add_tool(devopness_list_projects)
    mcp_server.add_tool(devopness_list_servers)
    mcp_server.add_tool(devopness_list_services)

    mcp_server.add_tool(devopness_create_application)
    mcp_server.add_tool(devopness_create_cloud_server)
    mcp_server.add_tool(devopness_create_service)
    mcp_server.add_tool(devopness_create_ssh_key)
    mcp_server.add_tool(devopness_create_webhook)
    mcp_server.add_tool(devopness_deploy_application)
    mcp_server.add_tool(devopness_deploy_service)
    mcp_server.add_tool(devopness_deploy_ssh_key)


async def devopness_get_user_profile() -> UserMe:
    await ensure_authenticated()
    current_user = await devopness.users.get_user_me()

    return current_user.data


async def devopness_list_projects() -> MCPResponse[List[ProjectRelation]]:
    await ensure_authenticated()
    response = await devopness.projects.list_projects()

    return MCPResponse.ok(
        response.data,
        [
            "If the user has multiple projects",
            "ask them to choose one of the listed project IDs",
            "to continue with the conversation.",
            "If the user has only one project, you can use it directly,",
            "and communicate with the user about it.",
            "Show the user the main information about the projects.",
            "{project.name} (ID: {project.id})",
        ],
    )


async def devopness_list_environments(
    project_id: int,
) -> MCPResponse[List[EnvironmentRelation]]:
    """
    Rules:
    1. DO NOT execute this tool without first confirming with the user which
       project ID to use.
    """
    await ensure_authenticated()
    response = await devopness.environments.list_project_environments(project_id)

    return MCPResponse.ok(
        response.data,
        [
            "If the user has multiple environments "
            "ask them to choose one of the listed environment IDs "
            "to continue with the conversation.",
            "If the user has only one environment, you can use it directly, "
            "and communicate with the user about it.",
            "Show the list in the following format:",
            "[N]. {environment.name} (ID: {environment.id})",
            "   - Type: {environment.type}",
            "   - Description: {environment.description}",
        ],
    )


async def devopness_list_credentials(environment_id: int) -> List[CredentialRelation]:
    await ensure_authenticated()
    response = await devopness.credentials.list_environment_credentials(environment_id)

    return response.data


async def devopness_list_servers(environment_id: int) -> List[ServerRelation]:
    await ensure_authenticated()
    response = await devopness.servers.list_environment_servers(environment_id)

    return response.data


async def devopness_list_applications(environment_id: int) -> List[ApplicationRelation]:
    await ensure_authenticated()
    response = await devopness.applications.list_environment_applications(
        environment_id
    )

    return response.data


async def devopness_list_application_pipelines(
    application_id: int,
) -> List[PipelineRelation]:
    await ensure_authenticated()
    response = await devopness.pipelines.list_pipelines_by_resource_type(
        application_id, "application"
    )

    return response.data


async def devopness_create_cloud_server(
    environment_id: int,
    server_input_settings: ServerEnvironmentCreate,
) -> Server:
    await ensure_authenticated()
    response = await devopness.servers.add_environment_server(
        environment_id,
        server_input_settings,
    )

    return response.data


async def devopness_create_application(
    environment_id: int,
    application_input_settings: ApplicationEnvironmentCreate,
) -> Application:
    await ensure_authenticated()
    response = await devopness.applications.add_environment_application(
        environment_id,
        application_input_settings,
    )

    return response.data


async def devopness_deploy_application(
    ctx: Context[Any, Any],
    source_value: str,
    pipeline_id: int | None = None,
    application_id: int | None = None,
    source_type: SourceTypePlain = "branch",
) -> MCPResponse[Action]:
    """
    Trigger a new deployment for application.

    You Should:
    - Use this function when you want to trigger a deployment.
    - If the user provides a pipeline ID, use it to trigger the deployment.
    - If the user does not provide a pipeline ID but provides an application ID,
      use this tool to fetch the available deployment pipelines for the application.
    - You MUST ask the user to provide a source value (e.g., branch name, commit hash)
      depending on the selected source type (e.g., "branch" or "commit").
    - You MUST confirm with the user all the values that will be used before calling
      this tool with the pipeline_id
    """
    await ensure_authenticated()

    if not pipeline_id:
        if not application_id:
            return MCPResponse.error(
                [
                    "A pipeline ID or an application ID is required to trigger"
                    " a deployment. Please ask the user to provide one of them."
                ]
            )

        response_pipelines = await devopness_list_application_pipelines(application_id)

        deploy_pipelines = [
            pipeline
            for pipeline in response_pipelines
            if pipeline.operation == "deploy"
        ]

        if len(deploy_pipelines) == 0:
            return MCPResponse.error(
                [
                    "No deployment pipelines were found for the given application ID. "
                    "Please ask the user to verify the application and try again."
                ]
            )

        return MCPResponse.warning(
            [
                "The following deployment pipelines were found for this application:",
                deploy_pipelines,
                "Please ask the user to choose one of the listed pipeline IDs. "
                "Then call this function again with the selected ID as the "
                "'pipeline_id' argument.",
            ],
        )

    response = await devopness.actions.add_pipeline_action(
        pipeline_id,
        {
            "source_type": source_type,
            "source_ref": source_value,
        },
    )

    await ctx.info(
        f"Deployment has been triggered using pipeline ID {pipeline_id} "
        f"with source type '{source_type}' and source value '{source_value}'."
    )

    await ctx.info(
        "To monitor the deployment progress, visit the following URL:\n"
        f"{response.data.url_web_permalink}"
    )

    return MCPResponse[Action].ok(
        response.data,
        [
            "To monitor the deployment progress, visit the following URL:",
            response.data.url_web_permalink,
            "Explain to the user how to monitor the deployment progress.",
            "Show the main information's about the action.",
        ],
    )


async def devopness_create_webhook(
    pipeline_id: int,
    hook_type: HookTypeParam,
    hook_settings: HookPipelineCreate,
) -> Hook:
    await ensure_authenticated()
    response = await devopness.hooks.add_pipeline_hook(
        hook_type,
        pipeline_id,
        hook_settings,
    )

    return response.data


async def devopness_create_ssh_key(
    environment_id: int,
    name: str,
    public_key: str,
) -> MCPResponse[SshKey]:
    """
    Create a new SSH key and add it to the given environment.

    You Should:
    - Use this function when you want to create a new SSH key.
    - Ask the user for a name for the SSH key. If the user does not provide a name,
      suggest one and ask the user if they accept the suggested name or prefer another.
    - Ask the user for the public key.
    - Explain to the user how to get the public key.
    - If the user asks how to create a new SSH key, ask the user which OS they are using
      and help them create a new SSH key.
    """
    await ensure_authenticated()
    response = await devopness.ssh_keys.add_environment_ssh_key(
        environment_id,
        {
            "name": name,
            "public_key": public_key,
        },
    )

    return MCPResponse[SshKey].ok(
        response.data,
        [
            "SSH key has been successfully created and added to the environment.",
            "Would you like to deploy this SSH key to your servers now?"
            " I can help you with the deployment process using the "
            "devopness_deploy_ssh_key tool.",
            "To proceed, please confirm if you'd like to deploy this key "
            "and specify which servers should have access to it.",
        ],
    )


async def devopness_deploy_ssh_key(
    ctx: Context[Any, Any],
    pipeline_id: int | None = None,
    ssh_key_id: int | None = None,
    server_ids: List[int] | None = None,
) -> MCPResponse[Action]:
    """
    Trigger a new deployment for an SSH key.

    You Should:
        - If the user provides a pipeline ID, use it to trigger the deployment.
        - If the user does not provide a pipeline ID but provides an SSH key ID,
          use this tool to fetch the available deployment pipelines for the SSH key.
        - You MUST ask the user to provide the list of servers to deploy to.
          - You can use the `devopness_list_servers` tool to help the user select
            the servers.
          - The Devopness is able to deploy to multiple servers at the same time.
          - The Devopness is able to deploy to a server that is still being provisioned.
          - If the user does not provide a list of servers, the Devopness will try
            deploy to all servers linked with the SSH key, which may cause errors
            if there are no servers linked with the SSH key.
        - You MUST confirm with the user all the values that will be used before calling
          this tool with the pipeline_id
    """
    await ensure_authenticated()

    if not pipeline_id:
        if not ssh_key_id:
            return MCPResponse.error(
                [
                    "A pipeline ID or an SSH key ID is required to trigger"
                    " a deployment. Please ask the user to provide one of them."
                ]
            )

        response_pipelines = await devopness.pipelines.list_pipelines_by_resource_type(
            ssh_key_id,
            "ssh-key",
        )

        if len(response_pipelines.data) == 0:
            return MCPResponse.error(
                [
                    "No deployment pipelines were found for the given SSH key ID. "
                    "Please ask the user to verify the SSH key and try again."
                ]
            )

        return MCPResponse.warning(
            [
                "The following deployment pipelines were found for this SSH key:",
                response_pipelines.data,
                "Please ask the user to choose one of the listed pipeline IDs.",
                "Then call this function again with the selected ID as the"
                " 'pipeline_id' argument.",
            ]
        )

    action_pipeline_create: ActionPipelineCreatePlain = {}
    if server_ids:
        action_pipeline_create["servers"] = server_ids

    response = await devopness.actions.add_pipeline_action(
        pipeline_id,
        action_pipeline_create,
    )

    await ctx.info(
        f"SSH key deployment has been triggered using pipeline ID {pipeline_id} "
        f"with SSH key ID {ssh_key_id}."
    )

    await ctx.info(
        "To monitor the deployment progress, visit the following URL:\n"
        f"{response.data.url_web_permalink}"
    )

    return MCPResponse[Action].ok(
        response.data,
        [
            "To monitor the deployment progress, visit the following URL:",
            response.data.url_web_permalink,
            "Explain to the user how to monitor the deployment progress.",
            "Show the main information's about the action.",
            "Explain the user how to use ssh to connect to the servers.",
        ],
    )


async def devopness_list_services(
    environment_id: int,
) -> MCPResponse[List[ServiceRelation]]:
    """
    Rules:
    1. DO NOT execute this tool without first confirming with the user which
       environment ID to use.
    """
    await ensure_authenticated()
    response = await devopness.services.list_environment_services(environment_id)

    return MCPResponse.ok(
        response.data,
        [
            "Use the template below to format the list:",
            "{service.type_human_readable} (ID: {service.id})",
            "   - Version: {service.version}",
            "   - Last Action: {service.last_action.type_human_readable}"
            " ({service.last_action.status_human_readable})",
        ],
    )


async def devopness_create_service(
    operation: Literal[
        "create",
        "list_available_service_types",
        "list_available_service_type_versions",
    ],
    environment_id: int,
    service_type: ServiceType | None = None,
    service_version: str | None = None,
) -> MCPResponse[Service] | None:
    """
    Rules:
    1. DO NOT execute this tool without first confirming with the user which
       environment ID to use.

    2. DO NOT execute this tool without first confirming with the user which
       service type to use.

    3. DO NOT execute this tool without first confirming with the user which
       service version to use.

    Usage:
    1. To create a service:
        - Call this function with `operation='create'`, providing a valid
          `environment_id`, `service_type`, and `service_version`.
        - Example: devopness_create_service(
            operation='create',
            environment_id=123,
            service_type=ServiceType.DOCKER,
            service_version='20.10',
        )

    2. To list available service types:
        - Call this function with `operation='list_available_service_types'`,
          providing a valid `environment_id`.
        - Example: devopness_create_service(
            operation='list_available_service_types',
            environment_id=123,
        )

    3. To list available service type versions:
        - Call this function with `operation='list_available_service_type_versions'`,
          providing a valid `environment_id` and `service_type`.
        - Example: devopness_create_service(
            operation='list_available_service_type_versions',
            environment_id=123,
            service_type=ServiceType.DOCKER,
        )
    """
    await ensure_authenticated()

    match operation:
        case "create":
            if not service_type or not service_version:
                return MCPResponse.error(
                    [
                        "Both service type and version are required to create"
                        " a service. "
                        "Please ask the user to provide these details."
                    ]
                )

            response = await devopness.services.add_environment_service(
                environment_id,
                {
                    "type": service_type,
                    "version": service_version,
                },
            )

            return MCPResponse.ok(
                response.data,
                [
                    "Service has been successfully created.",
                    "Show to user the main information about the service.",
                ],
            )

        case "list_available_service_types":
            response_services = await devopness.static.get_static_service_options()

            return MCPResponse.ok(
                instructions=[
                    "Here are the available service types and versions:",
                    response_services.data.types,
                ],
            )

        case "list_available_service_type_versions":
            if not service_type:
                return MCPResponse.error(
                    [
                        "A valid service type is required to list available"
                        " service versions. Please ask the user to provide a valid"
                        " service type."
                    ]
                )

            response_services = await devopness.static.get_static_service_options()

            service_type_versions = [
                static_service_type.supported_versions
                for static_service_type in response_services.data.types
                if static_service_type.value == service_type
            ]

            return MCPResponse.ok(
                instructions=[
                    "Here are the available service versions for the selected type:",
                    service_type_versions,
                ],
            )


async def devopness_deploy_service(
    operation: Literal[
        "deploy",
        "list_deploy_pipelines",
        "list_linked_servers",
    ],
    pipeline_id: int | None = None,
    service_id: int | None = None,
    server_ids: List[int] | None = None,
) -> MCPResponse[Action] | None:
    """
    Rules:
    1. DO NOT execute this tool without first confirming with the user which
       pipeline ID to use for deployment.

    2. DO NOT execute this tool without first confirming with the user which
       service ID to use for listing deployment pipelines or linked servers.

    Usage:

    1. To deploy a service:
        - Call this function with `operation='deploy'`, providing a valid
          `pipeline_id` and optionally `server_ids`.
        - Example: devopness_deploy_service(
            operation='deploy',
            pipeline_id=123,
            server_ids=[1, 2, 3]
        )

    2. To list deployment pipelines for a service:
        - Call this function with `operation='list_pipelines'` and provide a valid
          `service_id`.
        - Example: devopness_deploy_service(
            operation='list_pipelines',
            service_id=123
        )

    3. To list linked servers for a service:
        - Call this function with `operation='list_linked_servers'` and provide a valid
          `service_id`.
        - Example: devopness_deploy_service(
            operation='list_linked_servers',
            service_id=123
        )
    """
    await ensure_authenticated()

    match operation:
        case "deploy":
            if not pipeline_id:
                return MCPResponse.error(
                    [
                        "A valid pipeline ID is required to deploy the service. "
                        "Please ask the user to provide a valid pipeline ID."
                    ]
                )

            if server_ids and len(server_ids) == 0:
                return MCPResponse.error(
                    [
                        "You provided an empty list of server IDs.",
                        "Provide a list with at least one server ID"
                        " to deploy the service.",
                        "Or not provide the server_ids argument to"
                        " deploy the service to all servers linked with the service.",
                    ]
                )

            action_pipeline_create: ActionPipelineCreatePlain = {}
            if server_ids:
                action_pipeline_create["servers"] = server_ids

            deploy_response = await devopness.actions.add_pipeline_action(
                pipeline_id,
                action_pipeline_create,
            )

            return MCPResponse[Action].ok(
                deploy_response.data,
                [
                    "To monitor the deployment progress, visit the following URL:",
                    deploy_response.data.url_web_permalink,
                    "Explain to the user how to monitor the deployment progress.",
                    "Show the main information's about the action.",
                ],
            )

        case "list_deploy_pipelines":
            if not service_id:
                return MCPResponse.error(
                    [
                        "A service ID is required to list the deployment pipelines. "
                        "Please ask the user to provide a service ID."
                    ]
                )

            response = await devopness.pipelines.list_pipelines_by_resource_type(
                service_id, "service"
            )

            if len(response.data) == 0:
                return MCPResponse.error(
                    [
                        "No deployment pipelines were found for the given service ID. "
                        "Please ask the user to verify the service and try again."
                    ]
                )

            return MCPResponse.ok(
                instructions=[
                    "The following deployment pipelines were found for this service:",
                    response.data,
                    "Please ask the user to choose one of the listed pipeline IDs.",
                    "Then call this function again with the selected ID as the"
                    " 'pipeline_id' argument.",
                ]
            )

        case "list_linked_servers":
            if not service_id:
                return MCPResponse.error(
                    [
                        "A service ID is required to list the linked servers. "
                        "Please ask the user to provide a service ID."
                    ]
                )

            list_linked_servers_response = (
                await devopness.resource_links.list_resource_links_by_resource_type(
                    service_id,
                    "service",
                )
            )

            if len(list_linked_servers_response.data) == 0:
                return MCPResponse.error(
                    [
                        "No linked servers were found for the given service ID. "
                        "Please ask the user to verify the service and try again."
                    ]
                )

            return MCPResponse.ok(
                instructions=[
                    "The following servers are linked with this service:",
                    list_linked_servers_response.data,
                    "You can use these server IDs to deploy the service"
                    " to specific servers.",
                    "If you want to deploy the service to all linked servers, "
                    "you can provide an empty list of server IDs.",
                ],
            )
