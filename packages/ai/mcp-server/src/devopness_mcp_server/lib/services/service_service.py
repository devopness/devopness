from typing import List, cast

from devopness.models import (
    Action,
    ServiceType,
    StaticServiceType,
)

from ..devopness_api import devopness, ensure_authenticated
from ..models import ServerIDs, ServiceSummary
from ..response import MCPResponse
from ..utils import (
    get_format_list_instructions,
    get_format_resource_instructions,
    get_how_to_monitor_action_instructions,
    get_next_action_suggestion_instructions,
)


class ServiceService:
    @staticmethod
    async def tool_get_available_service_types() -> MCPResponse[
        List[StaticServiceType]
    ]:
        await ensure_authenticated()

        response = await devopness.static.get_static_service_options()

        return MCPResponse.ok(
            response.data.types,
            [
                get_format_list_instructions(
                    "#N. {service_type.human_readable}",
                    [
                        "Versions: {service_type.supported_versions}",
                    ],
                )
            ],
        )

    @staticmethod
    async def tool_create_service(
        environment_id: int,
        service_type: ServiceType,
        service_version: str,
    ) -> MCPResponse[ServiceSummary]:
        await ensure_authenticated()

        response = await devopness.services.add_environment_service(
            environment_id,
            {
                "type": service_type,
                "version": service_version,
            },
        )

        service = ServiceSummary(
            id=response.data.id,
            name=response.data.name,
            type=response.data.type,
            version=cast(str, response.data.version),
        )

        return MCPResponse.ok(
            service,
            [
                get_format_resource_instructions(
                    "service",
                    [
                        "#N. {service.name} (ID: {service.id})",
                        "Type: {service.type}",
                        "Version: {service.version}",
                    ],
                ),
                get_next_action_suggestion_instructions("deploy", "service"),
            ],
        )

    @staticmethod
    async def tool_deploy_service(
        pipeline_id: int,
        server_ids: ServerIDs,
    ) -> MCPResponse[Action]:
        await ensure_authenticated()

        response = await devopness.actions.add_pipeline_action(
            pipeline_id,
            {
                "servers": server_ids,
            },
        )

        return MCPResponse.ok(
            response.data,
            [
                get_how_to_monitor_action_instructions(response.data.url_web_permalink),
            ],
        )

    @staticmethod
    async def tool_list_services(
        environment_id: int,
    ) -> MCPResponse[List[ServiceSummary]]:
        await ensure_authenticated()

        response = await devopness.services.list_environment_services(environment_id)

        services = [
            ServiceSummary(
                id=service.id,
                name=service.name,
                type=service.type_human_readable,
                version=cast(str, service.version),
            )
            for service in response.data
        ]

        return MCPResponse.ok(
            services,
            [
                get_format_list_instructions(
                    "#N. {service.name} (ID: {service.id})",
                ),
            ],
        )
