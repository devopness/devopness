import unittest
from unittest.mock import AsyncMock, MagicMock, patch

from devopness import DevopnessClient, DevopnessClientAsync, DevopnessClientConfig


class TestVariableServiceListEnvironmentVariables(unittest.TestCase):
    def setUp(self) -> None:
        config = DevopnessClientConfig(base_url="https://test.local")
        self.client = DevopnessClient(config)

    def test_list_environment_variables_calls_correct_resource_type(self) -> None:
        with patch.object(
            self.client.variables,
            "list_variables_by_resource_type",
            return_value=MagicMock(),
        ) as mock:
            self.client.variables.list_environment_variables(1097)
            mock.assert_called_once_with(1097, "environment", page=None, per_page=None)

    def test_list_environment_variables_passes_pagination(self) -> None:
        with patch.object(
            self.client.variables,
            "list_variables_by_resource_type",
            return_value=MagicMock(),
        ) as mock:
            self.client.variables.list_environment_variables(1097, page=2, per_page=10)
            mock.assert_called_once_with(1097, "environment", page=2, per_page=10)


class TestVariableServiceAsyncListEnvironmentVariables(unittest.IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        config = DevopnessClientConfig(base_url="https://test.local")
        self.client = DevopnessClientAsync(config)

    async def test_list_environment_variables_calls_correct_resource_type(self) -> None:
        with patch.object(
            self.client.variables,
            "list_variables_by_resource_type",
            new_callable=AsyncMock,
        ) as mock:
            await self.client.variables.list_environment_variables(1097)
            mock.assert_called_once_with(1097, "environment", page=None, per_page=None)

    async def test_list_environment_variables_passes_pagination(self) -> None:
        with patch.object(
            self.client.variables,
            "list_variables_by_resource_type",
            new_callable=AsyncMock,
        ) as mock:
            await self.client.variables.list_environment_variables(1097, page=2, per_page=10)
            mock.assert_called_once_with(1097, "environment", page=2, per_page=10)
