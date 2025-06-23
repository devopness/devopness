from typing import List

from devopness.models import (
    ServiceType,
    StaticServiceType,
)

from ..devopness_api import devopness, ensure_authenticated
from ..models import ActionSummary, ServerIDs, ServiceSummary
from ..response import MCPResponse
from ..utils import (
    get_instructions_format_list,
    get_instructions_format_resource,
    get_instructions_how_to_monitor_action,
    get_instructions_next_action_suggestion,
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
                get_instructions_format_list(
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

        service = ServiceSummary.from_sdk_model(response.data)

        return MCPResponse.ok(
            service,
            [
                get_instructions_format_resource(
                    "service",
                    [
                        "#N. {service.name} (ID: {service.id})",
                        "Type: {service.type}",
                        "Version: {service.version}",
                    ],
                ),
                get_instructions_next_action_suggestion("deploy", "service"),
            ],
        )

    @staticmethod
    async def tool_deploy_service(
        pipeline_id: int,
        server_ids: ServerIDs,
    ) -> MCPResponse[ActionSummary]:
        await ensure_authenticated()

        response = await devopness.actions.add_pipeline_action(
            pipeline_id,
            {
                "servers": server_ids,
            },
        )

        action = ActionSummary.from_sdk_model(response.data)

        return MCPResponse.ok(
            action,
            [
                get_instructions_how_to_monitor_action(action),
            ],
        )

    @staticmethod
    async def tool_list_services(
        environment_id: int,
    ) -> MCPResponse[List[ServiceSummary]]:
        await ensure_authenticated()

        response = await devopness.services.list_environment_services(environment_id)

        services = [ServiceSummary.from_sdk_model(service) for service in response.data]

        return MCPResponse.ok(
            services,
            [
                get_instructions_format_list(
                    "#N. {service.name} (ID: {service.id})",
                ),
            ],
        )
