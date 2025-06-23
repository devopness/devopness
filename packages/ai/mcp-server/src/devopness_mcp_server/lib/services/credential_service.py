from typing import List

from devopness.models import CredentialRelation

from ..devopness_api import devopness, ensure_authenticated


class CredentialService:
    @staticmethod
    async def tool_list_credentials(
        environment_id: int,
    ) -> List[CredentialRelation]:
        await ensure_authenticated()
        response = await devopness.credentials.list_environment_credentials(
            environment_id
        )

        return response.data
