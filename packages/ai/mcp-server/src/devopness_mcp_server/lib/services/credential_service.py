from typing import List

from ..devopness_api import devopness, ensure_authenticated
from ..models import CredentialSummary
from ..response import MCPResponse
from ..utils import get_choose_resource_instructions, get_format_list_instructions


class CredentialService:
    @staticmethod
    async def tool_list_credentials(
        environment_id: int,
    ) -> MCPResponse[List[CredentialSummary]]:
        await ensure_authenticated()
        response = await devopness.credentials.list_environment_credentials(
            environment_id
        )

        credentials = [
            CredentialSummary.from_sdk_model(credential) for credential in response.data
        ]

        return MCPResponse.ok(
            credentials,
            [
                get_format_list_instructions(
                    "#N. {credential.name} (ID: {credential.id})",
                    [
                        "Provider: {credential.provider}",
                        "Provider Type: {credential.provider_type}",
                    ],
                ),
                get_choose_resource_instructions(
                    "credential",
                ),
            ],
        )
