"""
Devopness API Python SDK - Painless essential DevOps to everyone

Note:
    This is auto generated by OpenAPI Generator.
    https://openapi-generator.tech
"""

from typing import (
    Optional,
    Required,
    TypedDict,
    Union,
)

from pydantic import Field, StrictInt, StrictStr

from .. import DevopnessBaseModel
from .cloud_os_version_code import CloudOsVersionCode, CloudOsVersionCodePlain
from .server_provision_input import ServerProvisionInput, ServerProvisionInputPlain


class ActionTargetServerData(DevopnessBaseModel):
    """
    ActionTargetServerData

    Attributes:
        id (int): The unique id of the server
        hostname (str): The server&#39;s hostname
        provider_name (str): The name of the server&#39;s provider.
        provider_name_human_readable (str): The human readable version of the provider&#39;s name
        ip_address (str, optional, nullable): Public ipv4 address for server access
        ssh_port (int): The network port to which the SSH daemon is listening to SSH connections on the server
        os_version_code (CloudOsVersionCode, optional, nullable):
        provision_input (ServerProvisionInput):
    """

    id: StrictInt = Field(description="The unique id of the server")
    hostname: StrictStr = Field(description="The server's hostname")
    provider_name: StrictStr = Field(description="The name of the server's provider.")
    provider_name_human_readable: StrictStr = Field(
        description="The human readable version of the provider's name"
    )
    ip_address: Optional[StrictStr] = Field(
        description="Public ipv4 address for server access"
    )
    ssh_port: StrictInt = Field(
        description="The network port to which the SSH daemon is listening to SSH connections on the server"
    )
    os_version_code: Optional[CloudOsVersionCode]
    provision_input: ServerProvisionInput


class ActionTargetServerDataPlain(TypedDict, total=False):
    """
    Plain version of ActionTargetServerData.
    """

    id: Required[int]
    hostname: Required[str]
    provider_name: Required[str]
    provider_name_human_readable: Required[str]
    ip_address: Optional[str]
    ssh_port: Required[int]
    os_version_code: Optional[
        Union[
            CloudOsVersionCode,
            CloudOsVersionCodePlain,
        ]
    ]
    provision_input: Required[
        Union[
            ServerProvisionInput,
            ServerProvisionInputPlain,
        ]
    ]
