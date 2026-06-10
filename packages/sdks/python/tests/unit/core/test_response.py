import json
import math
import unittest
import warnings
from typing import Any, Self, cast
from unittest.mock import AsyncMock, Mock, patch

import httpx
from pydantic import ValidationError

from devopness import DevopnessClientConfig
from devopness.base import (
    DevopnessBaseModel,
    DevopnessBaseService,
    DevopnessBaseServiceAsync,
)
from devopness.core import DevopnessResponse


class DummyModel(DevopnessBaseModel):
    id: int

    @classmethod
    def from_json(cls, data: str) -> Self:
        json_data = json.loads(data)

        return cls(**json_data)


def build_response(
    content: Any = b"",
    status_code: int = 200,
    headers: dict[str, Any] | None = None,
) -> Mock:
    response = Mock(spec=httpx.Response)

    if type(content) in (dict, list):
        response.read.return_value = json.dumps(content).encode("utf-8")
    else:
        response.read.return_value = content
    response.status_code = status_code
    response.headers = headers or {}

    return response


def build_async_response(
    content: Any = b"",
    status_code: int = 200,
    headers: dict[str, Any] | None = None,
) -> Mock:
    response = Mock(spec=httpx.Response)
    response.aread = AsyncMock()

    if type(content) in (dict, list):
        response.aread.return_value = json.dumps(content).encode("utf-8")
    else:
        response.aread.return_value = content
    response.status_code = status_code
    response.headers = headers or {}

    return response


class TestDevopnessResponse(unittest.TestCase):
    def setUp(self) -> None:
        DevopnessBaseService._config = DevopnessClientConfig()
        DevopnessBaseServiceAsync._config = DevopnessClientConfig()

    def test_devopness_response_with_dict(self) -> None:
        response: DevopnessResponse[DummyModel] = DevopnessResponse(
            build_response({"id": 123}),
            DummyModel,
        )

        assert isinstance(response.data, DummyModel)
        assert response.data.id == 123

    def test_devopness_response_with_list(self) -> None:
        response: DevopnessResponse[list[DummyModel]] = DevopnessResponse(
            build_response([{"id": 123}, {"id": 456}]),
            list[DummyModel],
        )

        assert isinstance(response.data, list)
        assert len(response.data) == 2
        assert response.data[0].id == 123
        assert response.data[1].id == 456

    def test_devopness_response_with_str(self) -> None:
        response: DevopnessResponse[str] = DevopnessResponse(
            build_response(b"Hello"),
            str,
        )

        assert isinstance(response.data, str)
        assert response.data == "Hello"

    def test_devopness_response_with_int(self) -> None:
        response: DevopnessResponse[int] = DevopnessResponse(
            build_response(b"42"),
            int,
        )

        assert isinstance(response.data, int)
        assert response.data == 42

    def test_devopness_response_with_float(self) -> None:
        response: DevopnessResponse[float] = DevopnessResponse(
            build_response(b"3.14"),
            float,
        )

        assert isinstance(response.data, float)
        assert math.isclose(response.data, 3.14)

    def test_devopness_response_with_empty_body(self) -> None:
        response: DevopnessResponse[None] = DevopnessResponse(
            build_response(b""),
        )

        assert response.data is None

    def test_devopness_response_with_action_id(self) -> None:
        response: DevopnessResponse[None] = DevopnessResponse(
            build_response(
                headers={"x-devopness-action-id": "456"},
            ),
        )

        assert response.action_id == 456

    def test_devopness_response_with_invalid_action_id(self) -> None:
        response: DevopnessResponse[None] = DevopnessResponse(
            build_response(
                headers={"x-devopness-action-id": "invalid"},
            ),
        )

        assert response.action_id is None

    def test_devopness_response_with_pagination_last_page(self) -> None:
        response: DevopnessResponse[None] = DevopnessResponse(
            build_response(
                headers={
                    "link": '<https://api.example.com?page=5>; rel="last", <https://api.example.com?page=1>; rel="first"'
                },
            ),
        )

        assert response.page_count == 5

    def test_devopness_response_with_no_pagination(self) -> None:
        response: DevopnessResponse[None] = DevopnessResponse(
            build_response(),
        )

        assert response.page_count == 1

    def test_devopness_response_strict_validation_raises(self) -> None:
        DevopnessBaseService._config = DevopnessClientConfig(
            strict_validation_mode=True,
        )

        with self.assertRaises(ValidationError):
            DevopnessResponse(build_response({"id": "not-an-int"}), DummyModel)

    def test_devopness_response_non_strict_validation_returns_opaque_data(
        self,
    ) -> None:
        DevopnessBaseService._config = DevopnessClientConfig(
            strict_validation_mode=False,
        )

        with warnings.catch_warnings(record=True) as recorded_warnings:
            response: DevopnessResponse[DummyModel] = DevopnessResponse(
                build_response(
                    {
                        "id": "not-an-int",
                        "name": "Sample user",
                        "profile": {"slug": "sample-user"},
                    }
                ),
                DummyModel,
            )

        data = cast(Any, response.data)

        assert data.id == "not-an-int"
        assert data.name == "Sample user"
        assert data["id"] == "not-an-int"
        assert data.profile.slug == "sample-user"
        assert len(recorded_warnings) == 0

    def test_devopness_response_non_strict_validation_warns_in_debug_mode(
        self,
    ) -> None:
        DevopnessBaseService._config = DevopnessClientConfig(
            debug=True,
            strict_validation_mode=False,
        )

        with warnings.catch_warnings(record=True) as recorded_warnings:
            warnings.simplefilter("always")
            response: DevopnessResponse[DummyModel] = DevopnessResponse(
                build_response({"id": "not-an-int", "name": "Sample user"}),
                DummyModel,
            )

        data = cast(Any, response.data)

        assert data.name == "Sample user"
        assert len(recorded_warnings) == 1
        warning_message = str(recorded_warnings[0].message)
        assert "Failed to deserialize response body into DummyModel" in warning_message
        assert "Returning opaque response data instead" in warning_message
        assert "Input should be a valid integer" in warning_message


class TestDevopnessResponseAsync(unittest.IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        DevopnessBaseService._config = DevopnessClientConfig()
        DevopnessBaseServiceAsync._config = DevopnessClientConfig()

    @patch("httpx.AsyncClient.get")
    async def test_devopness_response_async(
        self,
        mock: Mock,
    ) -> None:
        url = "https://api.example.com/resource"
        mock.return_value = build_async_response({"id": 123})

        httpx_client = httpx.AsyncClient()
        httpx_response = await httpx_client.get(url)

        response: DevopnessResponse[DummyModel] = await DevopnessResponse.from_async(
            httpx_response, DummyModel
        )

        assert isinstance(response.data, DummyModel)
        assert response.data.id == 123

    async def test_devopness_response_async_non_strict_validation_returns_opaque_data(
        self,
    ) -> None:
        DevopnessBaseServiceAsync._config = DevopnessClientConfig(
            strict_validation_mode=False,
        )

        response: DevopnessResponse[DummyModel] = await DevopnessResponse.from_async(
            build_async_response({"id": "not-an-int", "name": "Sample user"}),
            DummyModel,
        )

        data = cast(Any, response.data)

        assert data.id == "not-an-int"
        assert data.name == "Sample user"
        assert data["name"] == "Sample user"
