from typing import Any, List

from mcp.server.fastmcp import Context

from devopness.models import Action, ActionPipelineCreatePlain, SshKey

from ..devopness_api import devopness, ensure_authenticated
from ..response import MCPResponse


class SSHKeyService:
    @staticmethod
    async def tool_create_ssh_key(
        environment_id: int,
        name: str,
        public_key: str,
    ) -> MCPResponse[SshKey]:
        """
        Create a new SSH key and add it to the given environment.

        You Should:
        - Use this function when you want to create a new SSH key.
        - Ask the user for a name for the SSH key. If the user does not provide a name,
          suggest one and ask the user if they accept the suggested name or prefer
          another.
        - Ask the user for the public key.
        - Explain to the user how to get the public key.
        - If the user asks how to create a new SSH key, ask the user which OS they are
          using and help them create a new SSH key.
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

    @staticmethod
    async def tool_deploy_ssh_key(
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
              - The Devopness is able to deploy to a server that is still being
                provisioned.
              - If the user does not provide a list of servers, the Devopness will try
                deploy to all servers linked with the SSH key, which may cause errors
                if there are no servers linked with the SSH key.
            - You MUST confirm with the user all the values that will be used before
              calling this tool with the pipeline_id
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

            response_pipelines = (
                await devopness.pipelines.list_pipelines_by_resource_type(
                    ssh_key_id,
                    "ssh-key",
                )
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
