from typing import List

from pydantic import Field

from ..devopness_api import devopness, ensure_authenticated
from ..models import CredentialSummary
from ..response import MCPResponse
from ..types import MAX_RESOURCES_PER_PAGE, ExtraData
from ..utils import (
    get_instructions_choose_resource,
    get_instructions_format_list,
    get_web_link_to_environment_resource,
)


class CredentialService:
    @staticmethod
    async def tool_list_credentials(
        project_id: int,
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
            per_page=MAX_RESOURCES_PER_PAGE,
        )

        credentials = [
            CredentialSummary.from_sdk_model(
                credential,
                ExtraData(
                    url_web_permalink=get_web_link_to_environment_resource(
                        project_id,
                        environment_id,
                        "credential",
                        credential.id,
                    ),
                ),
            )
            for credential in response.data
        ]

        return MCPResponse.ok(
            credentials,
            [
                get_instructions_format_list(
                    "- [{credential.name}]({credential.url_web_permalink})"
                    " (ID: {credential.id})",
                    [
                        "Provider: {credential.provider}",
                        "Provider Type: {credential.provider_type}",
                    ],
                ),
                f"Founded {len(credentials)} credentials.",
                get_instructions_choose_resource(
                    "credential",
                ),
            ],
        )
