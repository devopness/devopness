"""
Tests for the DevopnessClient class
"""

import unittest
from pathlib import Path
from typing import Any, cast
from unittest.mock import Mock, patch

import httpx
from pydantic import ValidationError

from devopness import DevopnessClient, DevopnessClientAsync, DevopnessClientConfig
from devopness.base import DevopnessBaseModel, DevopnessBaseService, DevopnessBaseServiceAsync
from devopness.core import DevopnessResponse


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

    @unittest.expectedFailure
    def test_multiple_clients_maintain_independent_configs(self) -> None:
        """
        Test that multiple DevopnessClient instances maintain independent configs.

        TODO: Fix config leak between multiple client instances
        --------------------------------------------------------
        Current Issue:
        - DevopnessBaseService._config is a CLASS ATTRIBUTE (shared globally)
        - Each DevopnessClient() overwrites this global config
        - DevopnessResponse reads from the global config at parse time
        - Result: Multiple clients interfere with each other's validation mode

        Why This Test Is Marked expectedFailure:
        - Fixing requires extensive refactoring:
          1. Convert _config from class to instance attribute in DevopnessBaseService
          2. Pass config to all service __init__ methods (50+ generated API files)
          3. Pass config through DevopnessResponse constructor
          4. Update DevopnessClient to pass config when creating each service
          5. Update all response creation calls in generated services
        - Not critical for single-client usage (most common case)

        Expected Behavior:
        - Each client uses its own config for response validation
        - Client 1 (strict mode) should raise ValidationError on invalid data
        - Client 2 (lenient mode) should return opaque data on invalid data

        Actual Behavior:
        - All clients share the last-set global config
        - Validation mode depends on which client was created last, not which
          client is making the request
        """

        class DummyModel(DevopnessBaseModel):
            id: int

        # Create client 1 with STRICT validation
        client1 = DevopnessClient(
            DevopnessClientConfig(strict_validation_mode=True)
        )

        # Create client 2 with LENIENT validation
        client2 = DevopnessClient(
            DevopnessClientConfig(strict_validation_mode=False)
        )

        # Mock an HTTP response with invalid data
        mock_response = Mock(spec=httpx.Response)
        mock_response.read.return_value = b'{"id": "not-an-int"}'
        mock_response.status_code = 200
        mock_response.headers = {}

        # Client 1 should RAISE (strict mode)
        # BUG: This actually returns opaque data because client2 overwrote the config
        with self.assertRaises(ValidationError):
            DevopnessResponse(mock_response, DummyModel)

        # Reset mock for reuse
        mock_response.read.return_value = b'{"id": "not-an-int"}'

        # Client 2 should RETURN OPAQUE DATA (lenient mode)
        response2: DevopnessResponse[DummyModel] = DevopnessResponse(
            mock_response, DummyModel
        )
        data2 = cast(Any, response2.data)
        self.assertEqual(data2.id, "not-an-int")


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
