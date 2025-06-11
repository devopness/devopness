from dataclasses import dataclass
from typing import Any, List

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
    mcp_server.add_tool(devopness_create_ssh_key)
    mcp_server.add_tool(devopness_create_webhook)
    mcp_server.add_tool(devopness_create_service)
    mcp_server.add_tool(devopness_deploy_application)
    mcp_server.add_tool(devopness_deploy_ssh_key)
    mcp_server.add_tool(devopness_deploy_service)


async def devopness_get_user_profile() -> UserMe:
    await ensure_authenticated()
    current_user = await devopness.users.get_user_me()

    return current_user.data


async def devopness_list_projects() -> List[ProjectRelation]:
    await ensure_authenticated()
    response = await devopness.projects.list_projects()

    return response.data


async def devopness_list_environments(project_id: int) -> List[EnvironmentRelation]:
    await ensure_authenticated()
    response = await devopness.environments.list_project_environments(project_id)

    return response.data


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
    environment_id: int | None = None,
) -> MCPResponse[List[ServiceRelation]]:
    """
    Usage:

    1. If you want to list all services in an environment:
       - Provide the environment_id as an argument.
       - Example: devopness_list_services(environment_id=123)
    """
    if environment_id is None:
        return MCPResponse.error(
            [
                "An environment ID is required to list services. "
                "Please ask the user to provide an environment ID."
            ]
        )

    if not isinstance(environment_id, int) or environment_id <= 0:
        return MCPResponse.error(
            [
                "The provided environment ID is invalid. "
                "Please ask the user to provide a valid environment ID."
            ]
        )

    await ensure_authenticated()
    response = await devopness.services.list_environment_services(environment_id)

    return MCPResponse.ok(
        response.data,
        [
            "Use the template below to format the list:",
            "{service.type_human_readable} (ID: {service.id})",
            "   - Version: {service.version}",
            "   - Last Action: {service.last_action.type_human_readable} ({service.last_action.status_human_readable})",
        ],
    )


@dataclass
class ServiceCreateOperation:
    """
    Operation to create a new service in a specific environment.
    """

    environment_id: int
    """
    The ID of the environment where the service will be created.
    """

    service_type: ServiceType
    """
    The type of the service to be created.
    """

    service_version: str
    """
    The version of the service to be created.
    """

    async def execute(self) -> MCPResponse[Service]:
        if not isinstance(self.environment_id, int) or self.environment_id <= 0:
            return MCPResponse.error(
                [
                    "A valid environment ID is required to create a service. "
                    "Please ask the user to provide a valid environment ID."
                ]
            )

        if not self.service_type or not self.service_version:
            return MCPResponse.error(
                [
                    "Both service type and version are required to create a service. "
                    "Please ask the user to provide these details."
                ]
            )

        response = await devopness.services.add_environment_service(
            self.environment_id,
            {
                "type": self.service_type,
                "version": self.service_version,
            },
        )

        return MCPResponse.ok(
            response.data,
            [
                "Service has been successfully created.",
                "Show to user the main information about the service.",
            ],
        )


@dataclass
class ServiceListAvailableServiceTypesOperation:
    """
    Operation to list all available service types and their versions.
    """

    async def execute(self) -> MCPResponse[None]:
        response_services = await devopness.static.get_static_service_options()

        return MCPResponse.ok(
            instructions=[
                "Here are the available service types and versions:",
                response_services.data.types,
            ],
        )


@dataclass
class ServiceListAvailableServiceTypeVersionsOperation:
    """
    Operation to list all available versions for a specific service type.
    """

    service_type: ServiceType
    """
    The type of the service for which to list available versions.
    """

    async def execute(self) -> MCPResponse[None]:
        response_services = await devopness.static.get_static_service_options()

        service_type_versions = [
            static_service_type.supported_versions
            for static_service_type in response_services.data.types
            if static_service_type.value == self.service_type
        ]

        if not service_type_versions:
            return MCPResponse.error(
                [
                    f"No versions found for the service type '{self.service_type}'. "
                    "Please ask the user to provide a valid service type."
                ]
            )

        return MCPResponse.ok(
            instructions=[
                "Here are the available service versions for the selected type:",
                service_type_versions,
            ],
        )


async def devopness_create_service(
    create_operation: ServiceCreateOperation | None = None,
    list_available_service_types_operation: ServiceListAvailableServiceTypesOperation
    | None = None,
    list_available_service_type_versions_operation: ServiceListAvailableServiceTypeVersionsOperation
    | None = None,
) -> MCPResponse[Service] | MCPResponse[None]:
    """
    Usage:

    1. If you want to create a new service:
       - Provide an instance of `ServiceCreateOperation` with the environment_id,
         service_type, and service_version.
       - Example: devopness_create_service(create_operation=ServiceCreateOperation(environment_id=123, service_type='web', service_version='1.0'))

    2. If you want to list all available service types:
       - Provide an instance of `ServiceListAvailableServiceTypesOperation`.
       - Example: devopness_create_service(list_available_service_types_operation=ServiceListAvailableServiceTypesOperation())

    3. If you want to list all available versions for a specific service type:
       - Provide an instance of `ServiceListAvailableServiceTypeVersionsOperation` with the service_type.
       - Example: devopness_create_service(list_available_service_type_versions_operation=ServiceListAvailableServiceTypeVersionsOperation(service_type='web'))
    """
    await ensure_authenticated()

    if create_operation:
        return await create_operation.execute()

    if list_available_service_types_operation:
        return await list_available_service_types_operation.execute()

    if list_available_service_type_versions_operation:
        return await list_available_service_type_versions_operation.execute()

    return MCPResponse.error(
        [
            "No operation provided. Please provide an instance of:",
            ServiceCreateOperation.__name__,
            ServiceListAvailableServiceTypesOperation.__name__,
            ServiceListAvailableServiceTypeVersionsOperation.__name__,
            "To perform the desired action.",
        ]
    )


@dataclass
class ServiceDeployOperation:
    """
    Operation to deploy a service using a specific deployment pipeline and server IDs.
    """

    pipeline_id: int
    """
    The ID of the deployment pipeline to use.
    """

    server_ids: List[int] | None = None
    """
    The list of server IDs to deploy the service to.
    If not provided, the service will be deployed to all servers linked with the service.
    """

    async def execute(self) -> MCPResponse[Action]:
        if not isinstance(self.pipeline_id, int) or self.pipeline_id <= 0:
            return MCPResponse.error(
                [
                    "A valid pipeline ID is required to deploy the service. "
                    "Please ask the user to provide a valid pipeline ID."
                ]
            )

        if self.server_ids and len(self.server_ids) == 0:
            return MCPResponse.error(
                [
                    "You provided an empty list of server IDs.",
                    "Provide a list with at least one server ID to deploy the service.",
                    "Or not provide the server_ids argument to deploy the service to all servers linked with the service.",
                ]
            )

        action_pipeline_create: ActionPipelineCreatePlain = {}
        if self.server_ids:
            action_pipeline_create["servers"] = self.server_ids

        deploy_response = await devopness.actions.add_pipeline_action(
            self.pipeline_id,
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


@dataclass
class ServiceListPipelinesOperation:
    """
    Operation to list deployment pipelines for a specific service.
    """

    service_id: int
    """
    The ID of the service to list the deployment pipelines for.
    """

    async def execute(self) -> MCPResponse[None]:
        if not self.service_id:
            return MCPResponse.error(
                [
                    "A service ID is required to list the deployment pipelines. "
                    "Please ask the user to provide a service ID."
                ]
            )

        response = await devopness.pipelines.list_pipelines_by_resource_type(
            self.service_id, "service"
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
                "Then call this function again with the selected ID as the 'pipeline_id' argument.",
            ]
        )


@dataclass
class ServiceListLinkedServersOperation:
    """
    Operation to list linked servers for a specific service.
    """

    service_id: int
    """
    The ID of the service to list the linked servers for.
    """

    async def execute(self) -> MCPResponse[None]:
        if not isinstance(self.service_id, int) or self.service_id <= 0:
            return MCPResponse.error(
                [
                    "A service ID is required to list the linked servers. "
                    "Please ask the user to provide a service ID."
                ]
            )

        list_linked_servers_response = (
            await devopness.resource_links.list_resource_links_by_resource_type(
                self.service_id,
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
                "You can use these server IDs to deploy the service to specific servers.",
                "If you want to deploy the service to all linked servers, "
                "you can provide an empty list of server IDs.",
            ],
        )


async def devopness_deploy_service(
    deploy_operation: ServiceDeployOperation | None = None,
    list_pipelines_operation: ServiceListPipelinesOperation | None = None,
    list_linked_servers_operation: ServiceListLinkedServersOperation | None = None,
) -> MCPResponse[Action] | MCPResponse[None]:
    """
    Usage:

    1. If you want to deploy a service using a specific deployment pipeline:
       - Provide an instance of `ServiceDeployOperation` with the pipeline_id and server_ids.
       - Example: devopness_deploy_service(deploy_operation=ServiceDeployOperation(pipeline_id=123, server_ids=[1, 2]))

    2. If you want to list deployment pipelines for a specific service:
       - Provide an instance of `ServiceListPipelinesOperation` with the service_id.
       - Example: devopness_deploy_service(list_pipelines_operation=ServiceListPipelinesOperation(service_id=123))

    3. If you want to list linked servers for a specific service:
       - Provide an instance of `ServiceListLinkedServersOperation` with the service_id.
       - Example: devopness_deploy_service(list_linked_servers_operation=ServiceListLinkedServersOperation(service_id=123))
    """
    await ensure_authenticated()

    if deploy_operation:
        return await deploy_operation.execute()

    if list_pipelines_operation:
        return await list_pipelines_operation.execute()

    if list_linked_servers_operation:
        return await list_linked_servers_operation.execute()

    return MCPResponse.error(
        [
            "No operation provided. Please provide an instance of:",
            ServiceDeployOperation.__name__,
            ServiceListPipelinesOperation.__name__,
            ServiceListLinkedServersOperation.__name__,
            "To perform the desired action.",
        ]
    )
