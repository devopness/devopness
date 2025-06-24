from typing import List

from pydantic import Field

from devopness.models import (
    CloudInstanceRelation,
    CloudOsVersionCode,
    CloudProviderServiceRegion,
    ServerCloudServiceCode,
)

from ..devopness_api import devopness, ensure_authenticated
from ..models import ServerSummary
from ..response import MCPResponse
from ..types import MAX_RESOURCES_PER_PAGE, ExtraData
from ..utils import (
    get_instructions_choose_resource,
    get_instructions_format_list,
    get_instructions_format_resource,
    get_instructions_how_to_monitor_action,
    get_instructions_next_action_suggestion,
    get_last_action_repl,
    get_web_link_to_environment_resource,
)


class ServerService:
    @staticmethod
    async def tool_get_cloud_service_regions(
        cloud_service_code: ServerCloudServiceCode,
    ) -> MCPResponse[List[CloudProviderServiceRegion]]:
        await ensure_authenticated()

        response = await devopness.static.get_static_cloud_provider_service(
            str(cloud_service_code)
        )

        return MCPResponse.ok(
            response.data.regions,
            [
                get_instructions_format_list(
                    "#N. {region.name} (Code: {region.code})",
                    [
                        "You MUST sort the regions by name.",
                    ],
                ),
                get_instructions_next_action_suggestion("create", "server"),
            ],
        )

    @staticmethod
    async def tool_get_available_instance_types(
        cloud_provider_service_code: ServerCloudServiceCode,
        region_code: str,
    ) -> MCPResponse[List[CloudInstanceRelation]]:
        await ensure_authenticated()

        response = await devopness.static.list_static_cloud_instances_by_cloud_provider_service_code_and_region_code(  # noqa: E501
            str(cloud_provider_service_code),
            region_code,
        )

        return MCPResponse.ok(
            response.data,
            [
                get_instructions_format_list(
                    "#N. {instance.name} ({instance.architecture})",
                    [
                        "CPU: {instance.vcpus} | RAM: {instance.memory} | Min Disk: {instance.default_disk_size}",  # noqa: E501
                        "Price: {instance.price_hourly}/hour (~{instance.price_monthly}/month) in {instance.price_currency}",  # noqa: E501
                        "You MUST sort the instances by lowest price per month.",
                    ],
                ),
                get_instructions_next_action_suggestion("create", "server"),
            ],
        )

    @staticmethod
    async def tool_list_servers(
        project_id: int,
        environment_id: int,
        page: int = Field(
            default=1,
            gt=0,
        ),
    ) -> MCPResponse[List[ServerSummary]]:
        await ensure_authenticated()

        response = await devopness.servers.list_environment_servers(
            environment_id,
            page,
            per_page=MAX_RESOURCES_PER_PAGE,
        )

        servers = [
            ServerSummary.from_sdk_model(
                server,
                ExtraData(
                    url_web_permalink=get_web_link_to_environment_resource(
                        project_id,
                        environment_id,
                        "server",
                        server.id,
                    ),
                ),
            )
            for server in response.data
        ]

        return MCPResponse.ok(
            servers,
            [
                get_instructions_format_list(
                    "- [{server.name}]({server.url_web_permalink}) (ID: {server.id})",
                    [
                        "**Status:** {server.status}",
                        "**IP Address:** {server.ip_address}",
                        "**SSH Port:** {server.ssh_port}",
                        "**Provider:** {server.provider_code}",
                        "**Region:** {server.provider_region}",
                        get_last_action_repl("server"),
                    ],
                ),
                f"Founded {len(servers)} servers.",
                "Names of servers: " + ", ".join([server.name for server in servers]),
                get_instructions_choose_resource("server"),
            ],
        )

    @staticmethod
    async def tool_create_cloud_server(
        project_id: int,
        environment_id: int,
        credential_id: int,
        cloud_service_code: ServerCloudServiceCode,
        cloud_service_region: str,
        cloud_service_instance_type: str,
        os_hostname: str,
        os_disk_size: int,
        os_version_code: CloudOsVersionCode = CloudOsVersionCode.UBUNTU_24_04,
    ) -> MCPResponse[ServerSummary]:
        """
        Rules:
        1. DO NOT execute this tool without first confirming with the user which
          environment ID to use.
        2. DO NOT execute this tool without first confirming with the user all
          parameters.
        3. BEFORE executing this tool, show to the user all values that will be
          used to create the server.
        """
        await ensure_authenticated()

        response = await devopness.servers.add_environment_server(
            environment_id,
            {
                "hostname": os_hostname,
                # TODO: credential_id type as INT on API Docs/SDK
                "credential_id": str(credential_id),
                "provision_input": {
                    "cloud_service_code": cloud_service_code,
                    # TODO: support server provision with custom subnet
                    "settings": {
                        "region": cloud_service_region,
                        "instance_type": cloud_service_instance_type,
                        "os_version_code": os_version_code,
                        "storage_size": os_disk_size,
                    },
                },
            },
        )

        server = ServerSummary.from_sdk_model(
            response.data,
            ExtraData(
                url_web_permalink=get_web_link_to_environment_resource(
                    project_id,
                    environment_id,
                    "server",
                    response.data.id,
                ),
            ),
        )

        return MCPResponse.ok(
            server,
            [
                get_instructions_format_resource(
                    "server",
                    [
                        "[{server.name}]({server.url_web_permalink}) (ID: {server.id})",
                        "Status: {server.status}",
                        "IP Address: {server.ip_address}",
                        "SSH Port: {server.ssh_port}",
                        "Provider: {server.provider_code}",
                        "Region: {server.provider_region}",
                    ],
                ),
                (
                    get_instructions_how_to_monitor_action(
                        server.last_action.url_web_permalink,
                    )
                    if server.last_action is not None
                    else ""
                ),
            ],
        )
