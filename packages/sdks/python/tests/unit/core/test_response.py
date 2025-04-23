import json
import unittest
from typing import Any, Optional, Self
from unittest.mock import Mock, patch

import httpx

from devopness._base import DevopnessBaseModel
from devopness.core import DevopnessResponse


class DummyModel(DevopnessBaseModel):
    id: int

    @classmethod
    def from_json(cls, raw_data: str) -> Self:
        data = json.loads(raw_data)

        return cls(**data)


def build_response(
    content: Any = b"",
    status_code: int = 200,
    headers: Optional[dict[str, Any]] = None,
) -> Mock:
    response = Mock(spec=httpx.Response)

    if isinstance(content, dict):
        response.read.return_value = json.dumps(content).encode("utf-8")
    else:
        response.read.return_value = content

    response.status_code = status_code
    response.headers = headers or {}

    return response


class TestDevopnessResponse(unittest.TestCase):
    def test_devopness_response_with_dict(self) -> None:
        response: DevopnessResponse[DummyModel] = DevopnessResponse(
            build_response({"id": 123}),
            DummyModel,
        )

        assert isinstance(response.data, DummyModel)
        assert response.data.id == 123

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
        assert response.data == 3.14

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


class TestDevopnessResponseAsync(unittest.IsolatedAsyncioTestCase):
    @patch("httpx.AsyncClient.get")
    async def test_devopness_response_async(
        self,
        mock: Mock,
    ) -> None:
        url = "https://api.example.com/resource"
        mock.return_value = build_response({"id": 123})

        httpx_client = httpx.AsyncClient()
        response: DevopnessResponse[DummyModel] = DevopnessResponse(
            await httpx_client.get(url),
            DummyModel,
        )

        assert isinstance(response.data, DummyModel)
        assert response.data.id == 123
