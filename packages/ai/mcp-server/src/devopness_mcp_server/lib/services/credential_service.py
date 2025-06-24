from typing import List

from pydantic import Field

from ..devopness_api import devopness, ensure_authenticated
from ..models import CredentialSummary
from ..response import MCPResponse
from ..utils import get_instructions_choose_resource, get_instructions_format_list


class CredentialService:
    @staticmethod
    async def tool_list_credentials(
        environment_id: int,
        page: int = Field(
            default=1,
            gt=0,
        ),
    ) -> MCPResponse[List[CredentialSummary]]:
        await ensure_authenticated()

        response = await devopness.credentials.list_environment_credentials(
            environment_id,
            page,
        )

        credentials = [
            CredentialSummary.from_sdk_model(credential) for credential in response.data
        ]

        return MCPResponse.ok(
            credentials,
            [
                get_instructions_format_list(
                    "#N. {credential.name} (ID: {credential.id})",
                    [
                        "Provider: {credential.provider}",
                        "Provider Type: {credential.provider_type}",
                    ],
                ),
                get_instructions_choose_resource(
                    "credential",
                ),
            ],
        )
