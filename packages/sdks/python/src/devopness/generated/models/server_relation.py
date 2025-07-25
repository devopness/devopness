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

from pydantic import Field, StrictBool, StrictInt, StrictStr

from .. import DevopnessBaseModel
from .action_relation_shallow import ActionRelationShallow, ActionRelationShallowPlain
from .credential_relation import CredentialRelation, CredentialRelationPlain
from .server_status import ServerStatus, ServerStatusPlain


class ServerRelation(DevopnessBaseModel):
    """
    ServerRelation

    Attributes:
        id (int): The unique id of the given record
        created_by (int): The id of the user who created the server and to whom the server belongs
        name (str): The server&#39;s name
        hostname (str): The server&#39;s hostname
        provider_name (str): The name of the server&#39;s provider.
        provider_name_human_readable (str): The human readable version of the provider&#39;s name
        credential (CredentialRelation, optional, nullable):
        region (str, optional, nullable): The region in which the server is located
        region_human_readable (str, optional, nullable): The human readable version of the region
        ip_address (str, optional): Public ipv4 address for server access
        ssh_port (int): The network port to which the SSH daemon is listening to SSH connections on the server
        active (bool): Tells if the server is active or not
        status (ServerStatus):
        last_action (ActionRelationShallow, optional, nullable):
        created_at (str, optional): The date and time when the record was created
        updated_at (str, optional): The date and time when the record was last updated
    """

    id: StrictInt = Field(description="The unique id of the given record")
    created_by: StrictInt = Field(
        description="The id of the user who created the server and to whom the server belongs"
    )
    name: StrictStr = Field(description="The server's name")
    hostname: StrictStr = Field(description="The server's hostname")
    provider_name: StrictStr = Field(description="The name of the server's provider.")
    provider_name_human_readable: StrictStr = Field(
        description="The human readable version of the provider's name"
    )
    credential: Optional[CredentialRelation] = None
    region: Optional[StrictStr] = Field(
        description="The region in which the server is located"
    )
    region_human_readable: Optional[StrictStr] = Field(
        description="The human readable version of the region"
    )
    ip_address: Optional[StrictStr] = Field(
        default=None, description="Public ipv4 address for server access"
    )
    ssh_port: StrictInt = Field(
        description="The network port to which the SSH daemon is listening to SSH connections on the server"
    )
    active: StrictBool = Field(description="Tells if the server is active or not")
    status: ServerStatus
    last_action: Optional[ActionRelationShallow] = None
    created_at: Optional[StrictStr] = Field(
        default=None, description="The date and time when the record was created"
    )
    updated_at: Optional[StrictStr] = Field(
        default=None, description="The date and time when the record was last updated"
    )


class ServerRelationPlain(TypedDict, total=False):
    """
    Plain version of ServerRelation.
    """

    id: Required[int]
    created_by: Required[int]
    name: Required[str]
    hostname: Required[str]
    provider_name: Required[str]
    provider_name_human_readable: Required[str]
    credential: Optional[
        Union[
            CredentialRelation,
            CredentialRelationPlain,
        ]
    ]
    region: Optional[str]
    region_human_readable: Optional[str]
    ip_address: Optional[str]
    ssh_port: Required[int]
    active: Required[bool]
    status: Required[
        Union[
            ServerStatus,
            ServerStatusPlain,
        ]
    ]
    last_action: Optional[
        Union[
            ActionRelationShallow,
            ActionRelationShallowPlain,
        ]
    ]
    created_at: Optional[str]
    updated_at: Optional[str]
