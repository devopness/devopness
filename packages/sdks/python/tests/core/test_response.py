import json
from typing import Any, Optional, Self
from unittest.mock import Mock

import httpx
import pytest
import respx

from devopness._base import DevopnessBaseModel
from devopness.core import DevopnessResponse


class DummyModel(DevopnessBaseModel):
    id: int

    @classmethod
    def from_json(cls, raw_data: str) -> Self:
        data = json.loads(raw_data)

        return cls(**data)


def build_response(
    content: Any,
    status_code: int = 200,
    headers: Optional[dict] = None,
) -> Mock:
    response = Mock(spec=httpx.Response)

    response.status_code = status_code
    response.read.return_value = json.dumps(content).encode("utf-8")
    response.headers = headers or {}

    return response


def test_response_with_dict() -> None:
    response = build_response({"id": 123})
    dev_response: DevopnessResponse[DummyModel] = DevopnessResponse(
        response,
        DummyModel,
    )

    assert isinstance(dev_response.data, DummyModel)
    assert dev_response.data.id == 123


def test_response_with_int() -> None:
    response = build_response(42)
    response.read.return_value = b"42"

    dev_response: DevopnessResponse[int] = DevopnessResponse(
        response,
        int,
    )

    assert dev_response.data == 42


def test_response_with_str() -> None:
    response = build_response("Hello")
    response.read.return_value = b"Hello"

    dev_response: DevopnessResponse[str] = DevopnessResponse(
        response,
        str,
    )

    assert dev_response.data == "Hello"


def test_response_with_float() -> None:
    response = build_response(3.14)
    response.read.return_value = b"3.14"

    dev_response: DevopnessResponse[float] = DevopnessResponse(
        response,
        float,
    )

    assert dev_response.data == 3.14


def test_response_with_empty_body() -> None:
    response = build_response(None)
    response.read.return_value = b""

    dev_response: DevopnessResponse = DevopnessResponse(
        response,
    )

    assert dev_response.data is None


def test_response_with_action_id() -> None:
    headers = {"x-devopness-action-id": "456"}
    response = build_response({}, headers=headers)

    dev_response: DevopnessResponse = DevopnessResponse(
        response,
    )

    assert dev_response.action_id == 456


def test_response_with_invalid_action_id() -> None:
    headers = {"x-devopness-action-id": "invalid"}
    response = build_response({}, headers=headers)

    dev_response: DevopnessResponse = DevopnessResponse(
        response,
    )

    assert dev_response.action_id is None


def test_response_with_pagination_last_page() -> None:
    headers = {
        "link": '<https://api.example.com?page=5>; rel="last", <https://api.example.com?page=1>; rel="first"'  # noqa: E501
    }
    response = build_response({}, headers=headers)

    dev_response: DevopnessResponse = DevopnessResponse(
        response,
    )

    assert dev_response.page_count == 5


def test_response_with_no_pagination() -> None:
    response = build_response({})

    dev_response: DevopnessResponse = DevopnessResponse(
        response,
    )

    assert dev_response.page_count == 1


@respx.mock
@pytest.mark.asyncio
async def test_devopness_response_async() -> None:
    url = "https://api.example.com/resource"

    response_data = {"id": 123}

    respx.get(url).mock(
        return_value=httpx.Response(
            200,
            json=response_data,
        )
    )

    async with httpx.AsyncClient() as client:
        response = await client.get(url)

    dev_response: DevopnessResponse[DummyModel] = DevopnessResponse(
        response,
        DummyModel,
    )

    assert dev_response.data.id == 123
