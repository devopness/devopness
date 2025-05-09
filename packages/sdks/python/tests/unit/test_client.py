import unittest
from typing import Union

from devopness import DevopnessClient, DevopnessClientAsync, DevopnessClientConfig
from devopness.base import DevopnessBaseService, DevopnessBaseServiceAsync
from devopness.services.action_service import (
    ActionService,
    ActionServiceAsync,
)
from devopness.services.application_service import (
    ApplicationService,
    ApplicationServiceAsync,
)
from devopness.services.credential_service import (
    CredentialService,
    CredentialServiceAsync,
)
from devopness.services.cron_job_service import (
    CronJobService,
    CronJobServiceAsync,
)
from devopness.services.daemon_service import (
    DaemonService,
    DaemonServiceAsync,
)
from devopness.services.environment_service import (
    EnvironmentService,
    EnvironmentServiceAsync,
)
from devopness.services.network_service import (
    NetworkService,
    NetworkServiceAsync,
)
from devopness.services.pipeline_service import (
    PipelineService,
    PipelineServiceAsync,
)
from devopness.services.project_service import (
    ProjectService,
    ProjectServiceAsync,
)
from devopness.services.resource_link_service import (
    ResourceLinkService,
    ResourceLinkServiceAsync,
)
from devopness.services.server_service import (
    ServerService,
    ServerServiceAsync,
)
from devopness.services.service_service import (
    ServiceService,
    ServiceServiceAsync,
)
from devopness.services.ssh_key_service import (
    SSHKeyService,
    SSHKeyServiceAsync,
)
from devopness.services.subnet_service import (
    SubnetService,
    SubnetServiceAsync,
)
from devopness.services.user_service import (
    UserService,
    UserServiceAsync,
)
from devopness.services.variable_service import (
    VariableService,
    VariableServiceAsync,
)
from devopness.services.virtual_host_service import (
    VirtualHostService,
    VirtualHostServiceAsync,
)

EXPECTED_SERVICES: dict[
    str,
    list[
        tuple[
            str,
            Union[
                type[DevopnessBaseService],
                type[DevopnessBaseServiceAsync],
            ],
        ],
    ],
] = {
    "async": [
        ("actions", ActionServiceAsync),
        ("applications", ApplicationServiceAsync),
        ("credentials", CredentialServiceAsync),
        ("cron_jobs", CronJobServiceAsync),
        ("daemons", DaemonServiceAsync),
        ("environments", EnvironmentServiceAsync),
        ("networks", NetworkServiceAsync),
        ("pipelines", PipelineServiceAsync),
        ("projects", ProjectServiceAsync),
        ("resource_links", ResourceLinkServiceAsync),
        ("servers", ServerServiceAsync),
        ("services", ServiceServiceAsync),
        ("ssh_keys", SSHKeyServiceAsync),
        ("subnets", SubnetServiceAsync),
        ("users", UserServiceAsync),
        ("variables", VariableServiceAsync),
        ("virtual_hosts", VirtualHostServiceAsync),
    ],
    "sync": [
        ("actions", ActionService),
        ("applications", ApplicationService),
        ("credentials", CredentialService),
        ("cron_jobs", CronJobService),
        ("daemons", DaemonService),
        ("environments", EnvironmentService),
        ("networks", NetworkService),
        ("pipelines", PipelineService),
        ("projects", ProjectService),
        ("resource_links", ResourceLinkService),
        ("servers", ServerService),
        ("services", ServiceService),
        ("ssh_keys", SSHKeyService),
        ("subnets", SubnetService),
        ("users", UserService),
        ("variables", VariableService),
        ("virtual_hosts", VirtualHostService),
    ],
}


class TestDevopnessClient(unittest.TestCase):
    def test_client_has_expected_services(self) -> None:
        devopness = DevopnessClient()
        current_services = devopness.__annotations__

        for service_name, service_class in EXPECTED_SERVICES["sync"]:
            service = getattr(devopness, service_name)

            self.assertIsInstance(service, service_class)
            current_services.pop(service_name)

        self.assertEqual(
            len(current_services),
            0,
            f"ERROR: Unexpected services in Devopness Client: {current_services.keys()}",
        )

    def test_config_is_shared_across_services(self) -> None:
        config = DevopnessClientConfig(base_url="https://test.local", debug=True)
        devopness = DevopnessClient(config)

        self.assertEqual(DevopnessBaseService._config.base_url, config.base_url)
        self.assertEqual(DevopnessBaseService._config.debug, config.debug)

        for service_name, _ in EXPECTED_SERVICES["sync"]:
            service: DevopnessBaseService = getattr(devopness, service_name)

            self.assertEqual(service._config.base_url, config.base_url)
            self.assertEqual(service._config.debug, config.debug)


class TestDevopnessClientAsync(unittest.IsolatedAsyncioTestCase):
    async def test_client_has_expected_services(self) -> None:
        devopness = DevopnessClientAsync()
        current_services = devopness.__annotations__

        for service_name, service_class in EXPECTED_SERVICES["async"]:
            service = getattr(devopness, service_name)

            self.assertIsInstance(service, service_class)
            current_services.pop(service_name)

        self.assertEqual(
            len(current_services),
            0,
            f"ERROR: Unexpected services in Async Devopness Client: {current_services.keys()}",
        )

    def test_config_is_shared_across_services(self) -> None:
        config = DevopnessClientConfig(base_url="https://test.local", debug=True)
        devopness = DevopnessClientAsync(config)

        self.assertEqual(DevopnessBaseServiceAsync._config.base_url, config.base_url)
        self.assertEqual(DevopnessBaseServiceAsync._config.debug, config.debug)

        for service_name, _ in EXPECTED_SERVICES["async"]:
            service: DevopnessBaseServiceAsync = getattr(devopness, service_name)

            self.assertEqual(service._config.base_url, config.base_url)
            self.assertEqual(service._config.debug, config.debug)
