import os
import signal
import subprocess
import time
from typing import TypedDict, TypeVar

import httpx
import pytest

from devopness import DevopnessClient
from devopness._base.base_model import DevopnessBaseModel
from devopness._generated.models import UserDict
from devopness.core import (
    DevopnessApiError,
    DevopnessNetworkError,
    DevopnessResponse,
)
from devopness.models import User

# pyright: reportTypedDictNotRequiredAccess=false

T = TypeVar("T", bound=DevopnessBaseModel)


class Spec(TypedDict):
    file_path: str

    devopness_access_token: str

    get_resource_user: UserDict
    get_resource_user_id: str


@pytest.fixture(scope="session")
def spec(tmp_path_factory):
    file_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "..",
        "..",
        "generator",
        "api",
        "spec.json",
    )

    spec = Spec(
        file_path=file_path,
        # Custom data to be used in tests
        devopness_access_token="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImYwYjQxZjk1MTdiYWExOTg4Zjk...",  # noqa: E501
        get_resource_user_id="2ab973e1-9528-4d67-aff0-209d74975830",
        get_resource_user={
            "id": 45678,
            "name": "Some One",
            "email": "someone@example.com",
            "url_slug": "someone",
        },
    )

    yield spec


@pytest.fixture(scope="session")
def prism_server(tmp_path_factory, spec: Spec):
    port = 4010
    url = f"http://localhost:{port}"

    command = ["prism", "mock", spec["file_path"], "-p", str(port)]
    process = None

    try:
        process = subprocess.Popen(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            preexec_fn=os.setsid,
        )

        max_retries = 30
        delay = 1.0  # seconds
        timeout = 1.0  # seconds

        for attempt in range(max_retries):
            try:
                response = httpx.get(url, timeout=timeout)
                if response.status_code:
                    break

            except Exception:
                time.sleep(delay)

        else:
            stdout, stderr = process.communicate(timeout=5)
            pytest.fail(
                "Prism server failed to start.\n"
                f"Stdout: {stdout.decode()}\n"
                f"Stderr: {stderr.decode()}"
            )

        if process.poll() is not None:
            stdout, stderr = process.communicate()
            pytest.fail(
                "Prism server failed to start."
                f" Exit code: {process.returncode}\n"
                f"Stdout: {stdout.decode()}\n"
                f"Stderr: {stderr.decode()}"
            )

        yield url  # URL will be passed to the test

    finally:
        if process and process.poll() is None:
            try:
                os.killpg(os.getpgid(process.pid), signal.SIGTERM)
                process.wait(timeout=5)

            except (subprocess.TimeoutExpired, ProcessLookupError):
                try:
                    os.killpg(os.getpgid(process.pid), signal.SIGKILL)

                except ProcessLookupError:
                    pass  # Process already gone


@pytest.fixture(scope="function")
def devopness(prism_server):
    url = prism_server
    devopness = DevopnessClient({"base_url": url})
    devopness.access_token = None
    yield devopness


@pytest.mark.asyncio
async def test_request_from_invalid_host_expects_network_error() -> None:
    client = DevopnessClient({"base_url": "http://invalid.devopness.local"})

    with pytest.raises(DevopnessNetworkError) as exc_info:
        await client.users.get_user("some-id")

    assert exc_info.value.url == "http://invalid.devopness.local/users/some-id"
    assert exc_info.value.method == "GET"

    string_output = str(exc_info.value)
    assert (
        "\nDevopness SDK Error: Network Request Failed\n\n"
        "Request: GET http://invalid.devopness.local/users/some-id\n"
        "Exception: [Errno -2]"
    ) in string_output


def test_sync_request_from_invalid_host_expects_network_error() -> None:
    client = DevopnessClient({"base_url": "http://invalid.devopness.local"})

    with pytest.raises(DevopnessNetworkError) as exc_info:
        client.users.get_user_sync("some-id")

    assert exc_info.value.url == "http://invalid.devopness.local/users/some-id"
    assert exc_info.value.method == "GET"

    string_output = str(exc_info.value)
    assert (
        "\nDevopness SDK Error: Network Request Failed\n\n"
        "Request: GET http://invalid.devopness.local/users/some-id\n"
        "Exception: [Errno -2]"
    ) in string_output


@pytest.mark.asyncio
async def test_request_from_invalid_endpoint_expects_network_error(
    prism_server: str,
) -> None:
    url = prism_server
    client = DevopnessClient({"base_url": f"{url}/inexistente"})

    with pytest.raises(DevopnessApiError) as exc_info:
        await client.users.get_user("some-id")

    assert exc_info.value.status_code == 404

    string_output = str(exc_info.value)
    assert (
        "\nDevopness SDK Error: API Request Failed\n\n"
        "Request: GET http://localhost:4010/inexistente/users/some-id\n"
        "Status Code: 404\n"
        "Message: Client error '404 Not Found'"
    ) in string_output


def test_sync_request_from_invalid_endpoint_expects_network_error(
    prism_server: str,
) -> None:
    url = prism_server
    client = DevopnessClient({"base_url": f"{url}/inexistente"})

    with pytest.raises(DevopnessApiError) as exc_info:
        client.users.get_user_sync("some-id")

    assert exc_info.value.status_code == 404

    string_output = str(exc_info.value)
    assert (
        "\nDevopness SDK Error: API Request Failed\n\n"
        "Request: GET http://localhost:4010/inexistente/users/some-id\n"
        "Status Code: 404\n"
        "Message: Client error '404 Not Found'"
    ) in string_output


@pytest.mark.asyncio
async def test_get_resource_expects_200(
    devopness: DevopnessClient,
    spec: Spec,
) -> None:
    devopness.access_token = spec["devopness_access_token"]
    resource = await devopness.users.get_user(spec["get_resource_user_id"])

    assert isinstance(resource, DevopnessResponse)
    assert resource.status == 200

    assert isinstance(resource.data, User)
    assert resource.data.id == spec["get_resource_user"]["id"]
    assert resource.data.name == spec["get_resource_user"]["name"]


def test_sync_get_resource_expects_200(
    devopness: DevopnessClient,
    spec: Spec,
) -> None:
    devopness.access_token = spec["devopness_access_token"]
    resource = devopness.users.get_user_sync(spec["get_resource_user_id"])

    assert isinstance(resource, DevopnessResponse)
    assert resource.status == 200

    assert isinstance(resource.data, User)
    assert resource.data.id == spec["get_resource_user"]["id"]
    assert resource.data.name == spec["get_resource_user"]["name"]
    assert resource.data.email == spec["get_resource_user"]["email"]


@pytest.mark.asyncio
async def test_get_resource_inexistent_expects_404_api_error(
    prism_server: str,
    spec: Spec,
) -> None:
    url = prism_server

    devopness = DevopnessClient(
        {
            "base_url": url,
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json",
                # Force prism to return 404 for this request
                "Prefer": "code=404",
            },
        }
    )
    devopness.access_token = spec["devopness_access_token"]

    with pytest.raises(DevopnessApiError) as exc_info:
        await devopness.users.get_user("invalid-id")

    assert exc_info.value.status_code == 404

    string_output = str(exc_info.value)
    assert (
        "\nDevopness SDK Error: API Request Failed\n\n"
        "Request: GET http://localhost:4010/users/invalid-id\n"
        "Status Code: 404\n"
    ) in string_output


def test_sync_get_resource_inexistent_expects_404_api_error(
    prism_server: str,
    spec: Spec,
) -> None:
    url = prism_server

    devopness = DevopnessClient(
        {
            "base_url": url,
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json",
                # Force prism to return 404 for this request
                "Prefer": "code=404",
            },
        }
    )
    devopness.access_token = spec["devopness_access_token"]

    with pytest.raises(DevopnessApiError) as exc_info:
        devopness.users.get_user_sync("invalid-id")

    assert exc_info.value.status_code == 404

    string_output = str(exc_info.value)
    assert (
        "\nDevopness SDK Error: API Request Failed\n\n"
        "Request: GET http://localhost:4010/users/invalid-id\n"
        "Status Code: 404\n"
    ) in string_output


@pytest.mark.asyncio
async def test_update_resource_expects_204(
    devopness: DevopnessClient,
    spec: Spec,
) -> None:
    devopness.access_token = spec["devopness_access_token"]
    resource = await devopness.users.get_user(spec["get_resource_user_id"])

    assert isinstance(resource, DevopnessResponse)
    assert resource.status == 200

    assert isinstance(resource.data, User)
    assert resource.data.id == spec["get_resource_user"]["id"]
    assert resource.data.name == spec["get_resource_user"]["name"]

    updated_resource = await devopness.users.update_user(
        spec["get_resource_user_id"],
        {
            "id": spec["get_resource_user_id"],
            "name": "Updated Name",
            "email": "updated@example.com",
            "url_slug": "updated",
        },
    )

    assert isinstance(updated_resource, DevopnessResponse)
    assert updated_resource.status == 204


def test_sync_update_resource_expects_204(
    devopness: DevopnessClient,
    spec: Spec,
) -> None:
    devopness.access_token = spec["devopness_access_token"]
    resource = devopness.users.get_user_sync(spec["get_resource_user_id"])

    assert isinstance(resource, DevopnessResponse)
    assert resource.status == 200

    assert isinstance(resource.data, User)
    assert resource.data.id == spec["get_resource_user"]["id"]
    assert resource.data.name == spec["get_resource_user"]["name"]

    updated_resource = devopness.users.update_user_sync(
        spec["get_resource_user_id"],
        {
            "id": spec["get_resource_user_id"],
            "name": "Updated Name",
            "email": "updated@example.com",
            "url_slug": "updated",
        },
    )

    assert isinstance(updated_resource, DevopnessResponse)
    assert updated_resource.status == 204


@pytest.mark.asyncio
async def test_update_resource_inexistent_expects_404_api_error(
    prism_server: str,
    spec: Spec,
) -> None:
    url = prism_server

    devopness = DevopnessClient(
        {
            "base_url": url,
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json",
                # Force prism to return 404 for this request
                "Prefer": "code=404",
            },
        }
    )
    devopness.access_token = spec["devopness_access_token"]

    with pytest.raises(DevopnessApiError) as exc_info:
        await devopness.users.update_user(
            "invalid-id",
            {
                "id": "invalid-id",
                "name": "Updated Name",
                "email": "updated@example.com",
                "url_slug": "updated",
            },
        )

    assert exc_info.value.status_code == 404

    string_output = str(exc_info.value)
    assert (
        "\nDevopness SDK Error: API Request Failed\n\n"
        "Request: PUT http://localhost:4010/users/invalid-id\n"
        "Status Code: 404\n"
    ) in string_output


def test_sync_update_resource_inexistent_expects_404_api_error(
    prism_server: str,
    spec: Spec,
) -> None:
    url = prism_server

    devopness = DevopnessClient(
        {
            "base_url": url,
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json",
                # Force prism to return 404 for this request
                "Prefer": "code=404",
            },
        }
    )
    devopness.access_token = spec["devopness_access_token"]

    with pytest.raises(DevopnessApiError) as exc_info:
        devopness.users.update_user_sync(
            "invalid-id",
            {
                "id": "invalid-id",
                "name": "Updated Name",
                "email": "updated@example.com",
                "url_slug": "updated",
            },
        )

    assert exc_info.value.status_code == 404

    string_output = str(exc_info.value)
    assert (
        "\nDevopness SDK Error: API Request Failed\n\n"
        "Request: PUT http://localhost:4010/users/invalid-id\n"
        "Status Code: 404\n"
    ) in string_output
