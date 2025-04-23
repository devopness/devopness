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
from devopness.core import DevopnessResponse
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
async def test_get_resource(devopness: DevopnessClient, spec: Spec) -> None:
    devopness.access_token = spec["devopness_access_token"]
    resource = await devopness.users.get_user(spec["get_resource_user_id"])

    assert isinstance(resource, DevopnessResponse)
    assert resource.status == 200

    assert isinstance(resource.data, User)
    assert resource.data.id == spec["get_resource_user"]["id"]
    assert resource.data.name == spec["get_resource_user"]["name"]


def test_get_resource_sync(devopness: DevopnessClient, spec: Spec) -> None:
    devopness.access_token = spec["devopness_access_token"]
    resource = devopness.users.get_user_sync(spec["get_resource_user_id"])

    assert isinstance(resource, DevopnessResponse)
    assert resource.status == 200

    assert isinstance(resource.data, User)
    assert resource.data.id == spec["get_resource_user"]["id"]
    assert resource.data.name == spec["get_resource_user"]["name"]
    assert resource.data.email == spec["get_resource_user"]["email"]
