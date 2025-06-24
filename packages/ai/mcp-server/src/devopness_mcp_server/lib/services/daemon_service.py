from typing import Annotated, List, Optional

from pydantic import Field

from ..devopness_api import devopness, ensure_authenticated
from ..models import ActionSummary, DaemonSummary
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


class DaemonService:
    @staticmethod
    async def tool_list_daemons(
        project_id: int,
        environment_id: int,
        page: int = Field(
            default=1,
            gt=0,
        ),
    ) -> MCPResponse[List[DaemonSummary]]:
        await ensure_authenticated()

        response = await devopness.daemons.list_environment_daemons(
            environment_id,
            page,
            per_page=MAX_RESOURCES_PER_PAGE,
        )

        daemons = [
            DaemonSummary.from_sdk_model(
                daemon,
                ExtraData(
                    url_web_permalink=get_web_link_to_environment_resource(
                        project_id,
                        environment_id,
                        "daemon",
                        daemon.id,
                    ),
                ),
            )
            for daemon in response.data
        ]

        return MCPResponse.ok(
            daemons,
            [
                get_instructions_format_list(
                    "- [{daemon.name}]({daemon.url_web_permalink}) (ID: {daemon.id})",
                    [
                        "**Command:** `{daemon.command}`",
                        "**Run as user:** {daemon.run_as_user}",
                        "**Working directory:** "
                        "`~/{daemon.application_name}/current/{daemon.working_directory}`"
                        "if {daemon.application_name} is set, "
                        "otherwise `{daemon.working_directory}`",
                    ],
                ),
                get_instructions_choose_resource(
                    "daemon",
                ),
            ],
        )

    @staticmethod
    async def tool_create_daemon(
        project_id: int,
        environment_id: int,
        name: str,
        command: str,
        working_directory: Annotated[
            str,
            Field(
                examples=[
                    "IF application is set: 'relative/path/in/app/directory'",
                    "IF application is not set: '/absolute/path'",
                ],
            ),
        ],
        process_count: int = 1,
        run_as_user: str = "devopness",
        application_id: Optional[int] = None,
    ) -> MCPResponse[DaemonSummary]:
        await ensure_authenticated()

        response = await devopness.daemons.add_environment_daemon(
            environment_id,
            {
                "name": name,
                "command": command,
                "run_as_user": run_as_user,
                "process_count": process_count,
                "working_directory": working_directory,
                "application_id": application_id,
            },
        )

        daemon = DaemonSummary.from_sdk_model(
            response.data,
            ExtraData(
                url_web_permalink=get_web_link_to_environment_resource(
                    project_id,
                    environment_id,
                    "daemon",
                    response.data.id,
                ),
            ),
        )

        return MCPResponse.ok(
            daemon,
            [
                get_instructions_format_resource(
                    "daemon",
                    [
                        "**Name:** [{daemon.name}]({daemon.url_web_permalink})"
                        " (ID: {daemon.id})",
                        "**Command:** `{daemon.command}`",
                        "**Run as user:** {daemon.run_as_user}",
                        "**Working directory:** "
                        "`~/{daemon.application_name}/current/{daemon.working_directory}`"
                        "if {daemon.application_name} is set, "
                        "otherwise `{daemon.working_directory}`",
                        "**Application:** {daemon.application_name} "
                        "(ID: {daemon.application_id})"
                        "if {daemon.application_name} is set, otherwise `-`",
                    ],
                ),
                get_instructions_next_action_suggestion("deploy", "daemon"),
            ],
        )

    @staticmethod
    async def tool_deploy_daemon(
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
