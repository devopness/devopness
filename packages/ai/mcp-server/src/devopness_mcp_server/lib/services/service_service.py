from typing import Any, List

from pydantic import Field

from devopness.models import (
    ServiceType,
)

from ..devopness_api import devopness, ensure_authenticated
from ..models import ActionSummary, ServiceSummary
from ..response import MCPResponse
from ..types import MAX_RESOURCES_PER_PAGE, ExtraData, TypeListServerID
from ..utils import (
    format_last_action_field,
    get_instructions_choose_resource,
    get_instructions_format_resource_table,
    get_instructions_format_table,
    get_instructions_how_to_monitor_action,
    get_instructions_next_action_suggestion,
    get_web_link_to_environment_resource,
)


class ServiceService:
    @staticmethod
    async def tool_get_available_service_types() -> MCPResponse[List[Any]]:
        await ensure_authenticated()

        response = await devopness.static.get_static_service_options()

        services = [
            {
                "type": service.value,
                "description": service.hint,
                "supported_versions": [
                    version.version for version in service.supported_versions
                ],
            }
            for service in response.data.types
        ]

        return MCPResponse.ok(
            services,
            [
                get_instructions_format_table(
                    [
                        (
                            "Type",
                            "**{service_type.type}**",
                        ),
                        (
                            "Supported versions",
                            "**{service_type.supported_versions}**",
                        ),
                        (
                            "Description",
                            "{service_type.description} or `-`",
                        ),
                    ]
                ),
                get_instructions_next_action_suggestion("create", "service"),
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
                get_instructions_format_resource_table(
                    [
                        (
                            "ID",
                            "{service.id}",
                        ),
                        (
                            "Type",
                            "[{service.type}]({service.url_web_permalink})",
                        ),
                        (
                            "Version",
                            "**{service.version}**",
                        ),
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
                get_instructions_format_table(
                    [
                        (
                            "ID",
                            "{service.id}",
                        ),
                        (
                            "Type",
                            "[{service.type}]({service.url_web_permalink})",
                        ),
                        (
                            "Version",
                            "**{service.version}**",
                        ),
                        ("Last Action", format_last_action_field("service")),
                    ]
                ),
                get_instructions_choose_resource("service"),
                get_instructions_next_action_suggestion("deploy", "service"),
            ],
        )
