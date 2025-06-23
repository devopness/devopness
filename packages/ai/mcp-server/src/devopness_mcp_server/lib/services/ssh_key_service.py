from typing import List

from devopness.models import Action

from ..devopness_api import devopness, ensure_authenticated
from ..models import PipelineSummary, SSHKeySummary
from ..response import MCPResponse
from ..utils import (
    get_format_list_instructions,
    get_how_to_monitor_action_instructions,
    get_next_action_suggestion_instructions,
)


class SSHKeyService:
    @staticmethod
    async def tool_list_ssh_key_pipelines(
        ssh_key_id: int,
    ) -> MCPResponse[List[PipelineSummary]]:
        await ensure_authenticated()
        response = await devopness.pipelines.list_pipelines_by_resource_type(
            ssh_key_id,
            "ssh-key",
        )

        pipelines = [
            PipelineSummary(
                id=pipeline.id,
                name=pipeline.name,
                operation=pipeline.operation_human_readable,
            )
            for pipeline in response.data
        ]

        return MCPResponse.ok(
            pipelines,
            [
                get_format_list_instructions(
                    "#N. {pipeline.name} (ID: {pipeline.id})",
                    [
                        "Operation: {pipeline.operation}",
                    ],
                ),
            ],
        )

    @staticmethod
    async def tool_create_ssh_key(
        environment_id: int,
        name: str,
        public_key: str,
    ) -> MCPResponse[SSHKeySummary]:
        """
        Rules:
        - If the user does not provide a public key, you MUST ask them to provide one.
        - You MUST offer to find the public key for the user.
        - You MUST offer to generate a new ssh key pair for the user.
        """
        await ensure_authenticated()
        response = await devopness.ssh_keys.add_environment_ssh_key(
            environment_id,
            {
                "name": name,
                "public_key": public_key,
            },
        )

        ssh_key = SSHKeySummary(
            id=response.data.id,
            name=response.data.name,
            fingerprint=response.data.fingerprint,
        )

        return MCPResponse.ok(
            ssh_key,
            [
                get_next_action_suggestion_instructions("deploy", "ssh-key"),
            ],
        )

    @staticmethod
    async def tool_deploy_ssh_key(
        pipeline_id: int,
        server_ids: List[int],
    ) -> MCPResponse[Action]:
        await ensure_authenticated()

        response = await devopness.actions.add_pipeline_action(
            pipeline_id,
            {
                "servers": server_ids,
            },
        )

        return MCPResponse[Action].ok(
            response.data,
            [
                get_how_to_monitor_action_instructions(response.data.url_web_permalink),
                "Show the user the command to remote connect"
                "the server(s) using the SSH Key.",
            ],
        )
