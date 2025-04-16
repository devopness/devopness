from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from devopness_api_client.models.ssl_certificate import SslCertificate
from devopness_api_client.models.ssl_certificate_environment_create import SslCertificateEnvironmentCreate
from devopness_api_client.models.ssl_certificate_relation import SslCertificateRelation

from packages.sdks.python.devopness.common.api_response import ApiResponse
from packages.sdks.python.devopness.services.api_base_service import ApiBaseService


class SSLCertificatesApiService(ApiBaseService):
    """
    SSLCertificatesApiService - Auto Generated
    """

    async def add_environment_ssl_certificate(
        self,
        environment_id: int,
        ssl_certificate_environment_create: SslCertificateEnvironmentCreate,
    ) -> ApiResponse[SslCertificate]:
        """
        Create a new ssl certificate
        """

        endpoint: str = f"/environments/{environment_id}/ssl-certificates"

        response = await self.post(endpoint, ssl_certificate_environment_create)

        return ApiResponse(response)

    async def delete_ssl_certificate(
        self,
        ssl_certificate_id: int,
    ) -> ApiResponse:
        """
        Delete a given SSL Certificate
        """

        endpoint: str = f"/ssl-certificates/{ssl_certificate_id}"

        response = await self.delete(endpoint)

        return ApiResponse(response)

    async def get_ssl_certificate(
        self,
        ssl_certificate_id: int,
    ) -> ApiResponse[SslCertificate]:
        """
        Get details of a single SSL certificate
        """

        endpoint: str = f"/ssl-certificates/{ssl_certificate_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def list_environment_ssl_certificates(
        self,
        environment_id: int,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[SslCertificateRelation]]:
        """
        Return a list of all SSL Certificates belonging to an environment
        """

        endpoint: str = f"/environments/{environment_id}/ssl-certificates"

        response = await self.get(endpoint)

        return ApiResponse(response)
