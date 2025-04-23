import os
import signal
import subprocess
import time

import httpx
import pytest
from devopness import DevopnessClient
from devopness.core import DevopnessResponse
from devopness.models import User


class TestUserService:
    @pytest.fixture(scope="session")
    def prism_server(self, tmp_path_factory):
        port = 4010
        spec_url = "https://raw.githubusercontent.com/devopness/devopness/refs/heads/main/packages/sdks/python/generator/api/spec.json"  # noqa

        url = f"http://localhost:{port}"
        command = ["prism", "mock", spec_url, "-p", str(port)]
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

    @pytest.mark.asyncio
    async def test_get_user(self, prism_server):
        url = prism_server
        devopness = DevopnessClient({"base_url": url})

        res_login = await devopness.users.login_user(
            {"email": "user@example.com", "password": "pa$$word"}
        )

        devopness.access_token = res_login.data.access_token

        user_id_to_get = "2ab973e1-9528-4d67-aff0-209d74975830"
        response = await devopness.users.get_user(user_id_to_get)

        assert isinstance(response, DevopnessResponse)
        assert response.status == 200

        assert isinstance(response.data, User)
        assert response.data.id == 45678
        assert response.data.name == "Some One"
        assert response.data.email == "someone@example.com"

    def test_get_user_sync(self, prism_server):
        url = prism_server
        devopness = DevopnessClient({"base_url": url})

        res_login = devopness.users.login_user_sync(
            {"email": "user@example.com", "password": "pa$$word"}
        )

        devopness.access_token = res_login.data.access_token

        user_id_to_get = "2ab973e1-9528-4d67-aff0-209d74975830"
        response = devopness.users.get_user_sync(user_id_to_get)

        assert isinstance(response, DevopnessResponse)
        assert response.status == 200

        assert isinstance(response.data, User)
        assert response.data.id == 45678
        assert response.data.name == "Some One"
        assert response.data.email == "someone@example.com"
