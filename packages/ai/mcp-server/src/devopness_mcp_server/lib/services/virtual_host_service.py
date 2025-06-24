from typing import Annotated, List, Optional

from pydantic import Field

from ..devopness_api import devopness, ensure_authenticated
from ..models import ActionSummary, VirtualHostSummary
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


class VirtualHostService:
    @staticmethod
    async def tool_list_virtual_hosts(
        project_id: int,
        environment_id: int,
        page: int = Field(
            default=1,
            gt=0,
        ),
    ) -> MCPResponse[List[VirtualHostSummary]]:
        await ensure_authenticated()

        response = await devopness.virtual_hosts.list_environment_virtual_hosts(
            environment_id,
            page,
            per_page=MAX_RESOURCES_PER_PAGE,
        )

        virtual_hosts = [
            VirtualHostSummary.from_sdk_model(
                virtual_host,
                ExtraData(
                    url_web_permalink=get_web_link_to_environment_resource(
                        project_id,
                        environment_id,
                        "virtual-host",
                        virtual_host.id,
                    ),
                ),
            )
            for virtual_host in response.data
        ]

        return MCPResponse.ok(
            virtual_hosts,
            [
                get_instructions_format_list(
                    "- [{virtual_host.name}]({virtual_host.url_web_permalink})"
                    " (ID: {virtual_host.id})",
                    [
                        "**Has active SSL:** {virtual_host.ssl_certificate}",
                        "**Working directory:** "
                        "`~/{virtual_host.application_name}/current/{virtual_host.root_directory}`"
                        "if {virtual_host.application_name} is set, "
                        "otherwise `not include the field`",
                        "**Routes to:** <<{virtual_host.application_listen_address}>>"
                        "if {virtual_host.application_listen_address} is set, "
                        "otherwise `not include the field`",
                    ],
                ),
                get_instructions_choose_resource(
                    "virtual-host",
                ),
            ],
        )
