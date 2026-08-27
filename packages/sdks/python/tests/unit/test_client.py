"""
Tests for the DevopnessClient class
"""

import unittest
from pathlib import Path
from unittest.mock import Mock, patch

import httpx

from devopness import DevopnessClient, DevopnessClientAsync, DevopnessClientConfig


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

    def test_config_is_isolated_across_services(self) -> None:
        config = DevopnessClientConfig(base_url="https://test.local", debug=True)
        devopness = DevopnessClient(config)

        self.assertEqual(devopness.actions._state.config.base_url, config.base_url)
        self.assertEqual(devopness.actions._state.config.debug, config.debug)

        for service_name in devopness.__annotations__:
            service = getattr(devopness, service_name)
            self.assertIs(service._state, devopness.actions._state)

    def test_multiple_clients_keep_independent_state(self) -> None:
        config_one = DevopnessClientConfig(
            base_url="https://one.local",
            debug=True,
        )
        config_two = DevopnessClientConfig(
            base_url="https://two.local",
            debug=False,
        )

        client_one = DevopnessClient(config_one)
        client_two = DevopnessClient(config_two)

        client_one.api_token = "token-one"  # ruff:ignore[hardcoded-password-string]
        client_two.api_token = "token-two"  # ruff:ignore[hardcoded-password-string]

        self.assertIsNot(client_one.actions._state, client_two.actions._state)
        self.assertIsNot(
            client_one.actions._state.config,
            client_two.actions._state.config,
        )
        self.assertEqual(client_one.api_token, "token-one")
        self.assertEqual(client_two.api_token, "token-two")
        self.assertEqual(client_one.actions._state.config.base_url, "https://one.local")
        self.assertEqual(client_two.actions._state.config.base_url, "https://two.local")

    def test_api_token_can_be_updated_after_initialization(self) -> None:
        devopness = DevopnessClient()

        devopness.api_token = "token-after-init"  # ruff:ignore[hardcoded-password-string]

        api_token = devopness.api_token
        self.assertEqual(api_token, "token-after-init")

    def test_access_token_can_be_updated_after_initialization(self) -> None:
        devopness = DevopnessClient()

        devopness.access_token = "access-after-init"  # ruff:ignore[hardcoded-password-string]

        access_token = devopness.access_token
        self.assertEqual(access_token, "access-after-init")

    @patch("httpx.Client._send_single_request")
    def test_clients_send_requests_with_their_own_state(
        self,
        mock: Mock,
    ) -> None:
        client_one = DevopnessClient(
            DevopnessClientConfig(base_url="https://one.local"),
        )
        client_two = DevopnessClient(
            DevopnessClientConfig(base_url="https://two.local"),
        )

        client_one.api_token = "token-one"  # ruff:ignore[hardcoded-password-string]
        client_two.api_token = "token-two"  # ruff:ignore[hardcoded-password-string]

        def build_response(request: httpx.Request) -> httpx.Response:
            return httpx.Response(200, request=request)

        mock.side_effect = build_response

        client_one.users.get_user("first-user")
        client_two.users.get_user("second-user")

        first_request: httpx.Request = mock.call_args_list[0].args[0]
        second_request: httpx.Request = mock.call_args_list[1].args[0]

        self.assertEqual(first_request.url, "https://one.local/users/first-user")
        self.assertEqual(second_request.url, "https://two.local/users/second-user")
        self.assertEqual(first_request.headers["Authorization"], "Bearer token-one")
        self.assertEqual(second_request.headers["Authorization"], "Bearer token-two")

    @patch("httpx.Client._send_single_request")
    def test_nested_team_services_share_client_state(
        self,
        mock: Mock,
    ) -> None:
        client = DevopnessClient(
            DevopnessClientConfig(base_url="https://nested.local"),
        )
        client.api_token = "nested-token"  # ruff:ignore[hardcoded-password-string]

        def build_response(request: httpx.Request) -> httpx.Response:
            return httpx.Response(200, request=request)

        mock.side_effect = build_response

        client.teams.members.list_team_members(7)

        request: httpx.Request = mock.call_args.args[0]

        self.assertEqual(request.url, "https://nested.local/teams/7/members")
        self.assertEqual(request.headers["Authorization"], "Bearer nested-token")


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

    def test_config_is_isolated_across_services(self) -> None:
        config = DevopnessClientConfig(base_url="https://test.local", debug=True)
        devopness = DevopnessClientAsync(config)

        self.assertEqual(devopness.actions._state.config.base_url, config.base_url)
        self.assertEqual(devopness.actions._state.config.debug, config.debug)

        for service_name in devopness.__annotations__:
            service = getattr(devopness, service_name)
            self.assertIs(service._state, devopness.actions._state)

    def test_multiple_clients_keep_independent_state(self) -> None:
        config_one = DevopnessClientConfig(
            base_url="https://one.local",
            debug=True,
        )
        config_two = DevopnessClientConfig(
            base_url="https://two.local",
            debug=False,
        )

        client_one = DevopnessClientAsync(config_one)
        client_two = DevopnessClientAsync(config_two)

        client_one.api_token = "token-one"  # ruff:ignore[hardcoded-password-string]
        client_two.api_token = "token-two"  # ruff:ignore[hardcoded-password-string]

        self.assertIsNot(client_one.actions._state, client_two.actions._state)
        self.assertIsNot(
            client_one.actions._state.config,
            client_two.actions._state.config,
        )
        self.assertEqual(client_one.api_token, "token-one")
        self.assertEqual(client_two.api_token, "token-two")
        self.assertEqual(client_one.actions._state.config.base_url, "https://one.local")
        self.assertEqual(client_two.actions._state.config.base_url, "https://two.local")

    def test_api_token_can_be_updated_after_initialization(self) -> None:
        devopness = DevopnessClientAsync()

        devopness.api_token = "token-after-init"  # ruff:ignore[hardcoded-password-string]

        api_token = devopness.api_token
        self.assertEqual(api_token, "token-after-init")

    def test_access_token_can_be_updated_after_initialization(self) -> None:
        devopness = DevopnessClientAsync()

        devopness.access_token = "access-after-init"  # ruff:ignore[hardcoded-password-string]

        access_token = devopness.access_token
        self.assertEqual(access_token, "access-after-init")

    @patch("httpx.AsyncClient._send_single_request")
    async def test_clients_send_requests_with_their_own_state(
        self,
        mock: Mock,
    ) -> None:
        client_one = DevopnessClientAsync(
            DevopnessClientConfig(base_url="https://one.local"),
        )
        client_two = DevopnessClientAsync(
            DevopnessClientConfig(base_url="https://two.local"),
        )

        client_one.api_token = "token-one"  # ruff:ignore[hardcoded-password-string]
        client_two.api_token = "token-two"  # ruff:ignore[hardcoded-password-string]

        def build_response(request: httpx.Request) -> httpx.Response:
            return httpx.Response(200, request=request)

        mock.side_effect = build_response

        await client_one.users.get_user("first-user")
        await client_two.users.get_user("second-user")

        first_request: httpx.Request = mock.call_args_list[0].args[0]
        second_request: httpx.Request = mock.call_args_list[1].args[0]

        self.assertEqual(first_request.url, "https://one.local/users/first-user")
        self.assertEqual(second_request.url, "https://two.local/users/second-user")
        self.assertEqual(first_request.headers["Authorization"], "Bearer token-one")
        self.assertEqual(second_request.headers["Authorization"], "Bearer token-two")

    @patch("httpx.AsyncClient._send_single_request")
    async def test_nested_team_services_share_client_state(
        self,
        mock: Mock,
    ) -> None:
        client = DevopnessClientAsync(
            DevopnessClientConfig(base_url="https://nested.local"),
        )
        client.api_token = "nested-token"  # ruff:ignore[hardcoded-password-string]

        def build_response(request: httpx.Request) -> httpx.Response:
            return httpx.Response(200, request=request)

        mock.side_effect = build_response

        await client.teams.members.list_team_members(7)

        request: httpx.Request = mock.call_args.args[0]

        self.assertEqual(request.url, "https://nested.local/teams/7/members")
        self.assertEqual(request.headers["Authorization"], "Bearer nested-token")
