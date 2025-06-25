from typing import List

from pydantic import Field

from devopness.models import (
    ServiceType,
    StaticServiceType,
)

from ..devopness_api import devopness, ensure_authenticated
from ..models import ActionSummary, ServiceSummary
from ..response import MCPResponse
from ..types import MAX_RESOURCES_PER_PAGE, ExtraData, TypeListServerID
from ..utils import (
    get_instructions_choose_resource,
    get_instructions_format_list,
    get_instructions_format_resource,
    get_instructions_how_to_monitor_action,
    get_instructions_next_action_suggestion,
    get_web_link_to_environment_resource,
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
        project_id: int,
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

        service = ServiceSummary.from_sdk_model(
            response.data,
            ExtraData(
                url_web_permalink=get_web_link_to_environment_resource(
                    project_id,
                    environment_id,
                    "service",
                    response.data.id,
                ),
            ),
        )

        return MCPResponse.ok(
            service,
            [
                get_instructions_format_resource(
                    "service",
                    [
                        "[{service.name}]({service.url_web_permalink})"
                        " (ID: {service.id})",
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
        server_ids: TypeListServerID,
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
                get_instructions_how_to_monitor_action(action.url_web_permalink),
            ],
        )

    @staticmethod
    async def tool_list_services(
        project_id: int,
        environment_id: int,
        page: int = Field(
            default=1,
            gt=0,
        ),
    ) -> MCPResponse[List[ServiceSummary]]:
        await ensure_authenticated()

        response = await devopness.services.list_environment_services(
            environment_id,
            page,
            per_page=MAX_RESOURCES_PER_PAGE,
        )

        services = [
            ServiceSummary.from_sdk_model(
                service,
                ExtraData(
                    url_web_permalink=get_web_link_to_environment_resource(
                        project_id,
                        environment_id,
                        "service",
                        service.id,
                    ),
                ),
            )
            for service in response.data
        ]

        return MCPResponse.ok(
            services,
            [
                get_instructions_format_list(
                    "- [{service.name}]({service.url_web_permalink})"
                    " (ID: {service.id})",
                ),
                f"Founded {len(services)} services.",
                get_instructions_choose_resource("service"),
                get_instructions_next_action_suggestion("deploy", "service"),
            ],
        )
