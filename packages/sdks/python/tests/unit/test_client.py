import unittest
from typing import Final

from devopness import DevopnessClient, DevopnessClientConfig
from devopness.base import DevopnessBaseService
from devopness.services.application_service import ApplicationService
from devopness.services.credential_service import CredentialService
from devopness.services.cron_job_service import CronJobService
from devopness.services.daemon_service import DaemonService
from devopness.services.environment_service import EnvironmentService
from devopness.services.network_service import NetworkService
from devopness.services.project_service import ProjectService
from devopness.services.server_service import ServerService
from devopness.services.service_service import ServiceService
from devopness.services.ssh_key_service import SSHKeyService
from devopness.services.subnet_service import SubnetService
from devopness.services.user_service import UserService
from devopness.services.variable_service import VariableService
from devopness.services.virtual_host_service import VirtualHostService


class TestDevopnessClient(unittest.TestCase):
    expected_services: Final[list[tuple[str, type]]] = [
        ("applications", ApplicationService),
        ("credentials", CredentialService),
        ("cron_jobs", CronJobService),
        ("daemons", DaemonService),
        ("environments", EnvironmentService),
        ("networks", NetworkService),
        ("projects", ProjectService),
        ("servers", ServerService),
        ("services", ServiceService),
        ("ssh_keys", SSHKeyService),
        ("subnets", SubnetService),
        ("users", UserService),
        ("variables", VariableService),
        ("virtual_hosts", VirtualHostService),
    ]

    def test_client_has_expected_services(self) -> None:
        devopness = DevopnessClient()
        current_services = devopness.__annotations__

        for service_name, service_class in self.expected_services:
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

        for service_name, _ in self.expected_services:
            service: DevopnessBaseService = getattr(devopness, service_name)

            self.assertEqual(service._config.base_url, config.base_url)
            self.assertEqual(service._config.debug, config.debug)
