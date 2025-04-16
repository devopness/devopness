from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from .models.application_options import ApplicationOptions
from .models.cloud_instance_relation import CloudInstanceRelation
from .models.cloud_provider_service import CloudProviderService
from .models.credential_options import CredentialOptions
from .models.cron_job_options import CronJobOptions
from .models.environment_options import EnvironmentOptions
from .models.network_rule_options import NetworkRuleOptions
from .models.permission_relation import PermissionRelation
from .models.resource_type_relation import ResourceTypeRelation
from .models.server_options import ServerOptions
from .models.service_options import ServiceOptions
from .models.user_profile_options import UserProfileOptions
from .models.virtual_host_options import VirtualHostOptions

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class StaticDataApiService(ApiBaseService):
    """
    StaticDataApiService - Auto Generated
    """

    async def get_static_application_options(
        self,
    ) -> ApiResponse[ApplicationOptions]:
        """
        List `Application` resource options
        """

        endpoint: str = "/static/application-options"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def get_static_cloud_provider_service(
        self,
        cloud_provider_service_code: str,
    ) -> ApiResponse[CloudProviderService]:
        """
        Get details of a single `Cloud Provider Service`
        """

        endpoint: str = f"/static/cloud-provider-service-options/{cloud_provider_service_code}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def get_static_credential_options(
        self,
    ) -> ApiResponse[CredentialOptions]:
        """
        List `Credential` resource options
        """

        endpoint: str = "/static/credential-options"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def get_static_cron_job_options(
        self,
    ) -> ApiResponse[CronJobOptions]:
        """
        List `CronJob` resource options
        """

        endpoint: str = "/static/cronjob-options"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def get_static_environment_options(
        self,
    ) -> ApiResponse[EnvironmentOptions]:
        """
        List `Environment` options
        """

        endpoint: str = "/static/environment-options"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def get_static_network_rule_options(
        self,
    ) -> ApiResponse[NetworkRuleOptions]:
        """
        List `Network Rule` options
        """

        endpoint: str = "/static/network-rule-options"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def get_static_server_options(
        self,
    ) -> ApiResponse[ServerOptions]:
        """
        List `Server` options
        """

        endpoint: str = "/static/server-options"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def get_static_service_options(
        self,
    ) -> ApiResponse[ServiceOptions]:
        """
        List `Service` resource options
        """

        endpoint: str = "/static/service-options"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def get_static_user_profile_options(
        self,
    ) -> ApiResponse[UserProfileOptions]:
        """
        List `User profile` options
        """

        endpoint: str = "/static/user-profile-options"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def get_static_virtual_host_options(
        self,
    ) -> ApiResponse[VirtualHostOptions]:
        """
        List `Virtual Host` options
        """

        endpoint: str = "/static/virtual-host-options"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def list_static_cloud_instances_by_cloud_provider_service_code_and_region_code(
        self,
        cloud_provider_service_code: str,
        region_code: str,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[CloudInstanceRelation]]:
        """
        List `Cloud Provider Service` instance types by region
        """

        endpoint: str = f"/static/cloud-provider-service-options/{cloud_provider_service_code}/regions/{region_code}/instances"f"/static/cloud-provider-service-options/{cloud_provider_service_code}/regions/{region_code}/instances"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def list_static_permissions(
        self,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[PermissionRelation]]:
        """
        List available `Role` permissions
        """

        endpoint: str = "/static/permissions"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def list_static_resource_types(
        self,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[ResourceTypeRelation]]:
        """
        List available resource types
        """

        endpoint: str = "/static/resource-types"

        response = await self.get(endpoint)

        return ApiResponse(response)
