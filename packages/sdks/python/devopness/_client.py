"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from typing import Optional, Union

from ._base import DevopnessBaseService
from ._client_config import DevopnessClientConfig, DevopnessClientConfigDict
from .services import (
    CredentialService,
    EnvironmentService,
    NetworkService,
    ProjectService,
    ServerService,
    SubnetService,
    UserService,
    VirtualHostService,
)

__all__ = ["DevopnessClient"]


class DevopnessClient:
    """
    DevopnessApiClient provides an interface to the Devopness API.
    """

    credentials: CredentialService
    environments: EnvironmentService
    networks: NetworkService
    projects: ProjectService
    servers: ServerService
    subnets: SubnetService
    users: UserService
    virtual_hosts: VirtualHostService

    def __init__(
        self,
        config: Optional[
            Union[DevopnessClientConfig, DevopnessClientConfigDict]
        ] = None,
    ) -> None:
        if config is None:
            config = DevopnessClientConfig()
        elif isinstance(config, dict):
            config = DevopnessClientConfig.from_dict(config)

        self.credentials = CredentialService(config)
        self.environments = EnvironmentService(config)
        self.networks = NetworkService(config)
        self.projects = ProjectService(config)
        self.servers = ServerService(config)
        self.subnets = SubnetService(config)
        self.users = UserService(config)
        self.virtual_hosts = VirtualHostService(config)

    def __set_access_token(self, access_token: str) -> None:
        # pylint: disable=protected-access
        DevopnessBaseService._access_token = access_token

    def __get_access_token(self) -> str:
        # pylint: disable=protected-access
        return DevopnessBaseService._access_token  # type: ignore

    access_token = property(fset=__set_access_token, fget=__get_access_token)
