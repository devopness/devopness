from typing import List

from devopness.models import (
    CloudInstanceRelation,
    CloudOsVersionCode,
    CloudProviderServiceRegion,
    Server,
    ServerCloudServiceCode,
    ServerRelation,
)

from ..devopness_api import devopness, ensure_authenticated
from ..response import MCPResponse


class ServerService:
    @staticmethod
    async def tool_get_regions_of_cloud_service(
        cloud_provider_service_code: ServerCloudServiceCode,
    ) -> MCPResponse[List[CloudProviderServiceRegion]]:
        await ensure_authenticated()

        response = await devopness.static.get_static_cloud_provider_service(
            str(cloud_provider_service_code)
        )

        return MCPResponse.ok(
            response.data.regions,
            [
                "Show the list in the following format:",
                "#N. {region.name} (Code: {region.code})",
                "Rules:",
                "1. Sort the regions by name.",
            ],
        )

    @staticmethod
    async def tool_get_instance_types_of_cloud_service_region(
        cloud_provider_service_code: ServerCloudServiceCode,
        region_code: str,
    ) -> MCPResponse[List[CloudInstanceRelation]]:
        await ensure_authenticated()

        response = await devopness.static.list_static_cloud_instances_by_cloud_provider_service_code_and_region_code(  # noqa: E501
            str(cloud_provider_service_code),
            region_code,
        )

        return MCPResponse.ok(
            response.data,
            [
                "Show the list in the following format:",
                "#N. {instance.name} ({instance.architecture})",
                " - CPU: {instance.vcpus} | RAM: {instance.memory} | Min Disk: {instance.default_disk_size}",  # noqa: E501
                " - Price: {instance.price_hourly}/hour (~{instance.price_monthly}/month) in {instance.price_currency}",  # noqa: E501
                "Rules:",
                "1. Group the instances by architecture.",
                "2. Sort the instances by price.",
            ],
        )

    @staticmethod
    async def tool_list_servers(environment_id: int) -> List[ServerRelation]:
        await ensure_authenticated()
        response = await devopness.servers.list_environment_servers(environment_id)

        return response.data

    @staticmethod
    async def tool_create_cloud_server(
        environment_id: int,
        credential_id: int,
        cloud_service_code: ServerCloudServiceCode,
        cloud_service_region: str,
        cloud_service_instance_type: str,
        os_hostname: str,
        os_disk_size: int,
        os_version_code: CloudOsVersionCode = CloudOsVersionCode.UBUNTU_24_04,
    ) -> Server:
        """
        Rules:
        1. DO NOT execute this tool without first confirming with the user which
          environment ID to use.
        2. DO NOT execute this tool without first confirming with the user all
          parameters.
        3. BEFORE executing this tool, show to the user all values that will be
          used to create the server.
        """
        await ensure_authenticated()
        response = await devopness.servers.add_environment_server(
            environment_id,
            {
                "hostname": os_hostname,
                # TODO: credential_id type as INT on API Docs/SDK
                "credential_id": str(credential_id),
                "provision_input": {
                    "cloud_service_code": cloud_service_code,
                    # TODO: support server provision with custom subnet
                    "settings": {
                        "region": cloud_service_region,
                        "instance_type": cloud_service_instance_type,
                        "os_version_code": os_version_code,
                        "storage_size": os_disk_size,
                    },
                },
            },
        )

        return response.data
