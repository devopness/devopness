"""
Tests for the DevopnessClient class
"""

import unittest
from pathlib import Path

from devopness import DevopnessClient, DevopnessClientAsync, DevopnessClientConfig
from devopness.base import DevopnessBaseService, DevopnessBaseServiceAsync


def build_expected_services() -> set[str]:
    """Get all service module names from the services directory."""
    services_dir = (
        Path(__file__).parent.parent.parent / "src" / "devopness" / "services"
    )
    service_files = services_dir.glob("*_service.py")

    services: set[str] = set()
    for service_file in service_files:
        name = service_file.stem
        name = name.replace("_service", "")

        if name != "static":
            name = name + "s"

        services.add(name)

    return services


EXPECTED_SERVICES = build_expected_services()


class TestDevopnessClient(unittest.TestCase):
    def test_client_has_expected_services(self) -> None:
        devopness = DevopnessClient()
        client_services = set(devopness.__annotations__)

        missing_services = EXPECTED_SERVICES - client_services
        if missing_services:
            self.fail(
                "The following services are missing from the DevopnessClient:"
                f" {sorted(missing_services)}"
            )

        unexpected_services = client_services - EXPECTED_SERVICES
        if unexpected_services:
            self.fail(
                "The following unexpected services found in DevopnessClient: "
                f"{sorted(unexpected_services)}"
            )

        for service_name in devopness.__annotations__:
            service = getattr(devopness, service_name)
            self.assertIsInstance(service, devopness.__annotations__[service_name])

    def test_config_is_shared_across_services(self) -> None:
        config = DevopnessClientConfig(base_url="https://test.local", debug=True)
        devopness = DevopnessClient(config)

        self.assertEqual(DevopnessBaseService._config.base_url, config.base_url)
        self.assertEqual(DevopnessBaseService._config.debug, config.debug)

        for service_name in devopness.__annotations__:
            service: DevopnessBaseService = getattr(devopness, service_name)

            self.assertEqual(service._config.base_url, config.base_url)
            self.assertEqual(service._config.debug, config.debug)


class TestDevopnessClientAsync(unittest.IsolatedAsyncioTestCase):
    async def test_client_has_expected_services(self) -> None:
        devopness = DevopnessClientAsync()
        client_services = set(devopness.__annotations__)

        missing_services = EXPECTED_SERVICES - client_services
        if missing_services:
            self.fail(
                "The following services are missing from the DevopnessClientAsync:"
                f" {sorted(missing_services)}"
            )

        unexpected_services = client_services - EXPECTED_SERVICES
        if unexpected_services:
            self.fail(
                "The following unexpected services found in DevopnessClientAsync:"
                f" {sorted(unexpected_services)}"
            )

        for service_name in devopness.__annotations__:
            service = getattr(devopness, service_name)
            self.assertIsInstance(service, devopness.__annotations__[service_name])

    def test_config_is_shared_across_services(self) -> None:
        config = DevopnessClientConfig(base_url="https://test.local", debug=True)
        devopness = DevopnessClientAsync(config)

        self.assertEqual(DevopnessBaseServiceAsync._config.base_url, config.base_url)
        self.assertEqual(DevopnessBaseServiceAsync._config.debug, config.debug)

        for service_name in devopness.__annotations__:
            service: DevopnessBaseServiceAsync = getattr(devopness, service_name)

            self.assertEqual(service._config.base_url, config.base_url)
            self.assertEqual(service._config.debug, config.debug)
