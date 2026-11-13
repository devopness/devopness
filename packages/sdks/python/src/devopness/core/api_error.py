"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

import contextlib
import json

import httpx

from .sdk_error import DevopnessSdkError

__all__ = [
    "DevopnessApiError",
    "raise_devopness_api_error",
    "raise_devopness_api_error_sync",
]


class DevopnessApiError(DevopnessSdkError):
    """
    Exception raised when the Devopness API responds with an HTTP error status.

    Attributes:
        status_code (int): HTTP status code returned by the API.
        response_text (str): Raw response body text for debugging.
        request_url (Optional[str]): URL of the failed request.
        request_method (Optional[str]): HTTP method used in the failed request.
        message (str): Human-readable explanation of the error.
        errors (Optional[dict[str, list[str]]]): Detailed API validation
                                              or domain errors.
    """

    status_code: int
    response_text: str
    request_url: str | None = None
    request_method: str | None = None
    message: str
    errors: dict[str, object] | None = None

    def __init__(self, err: httpx.HTTPStatusError) -> None:
        e_res = err.response
        self.status_code = e_res.status_code
        self.response_text = e_res.text

        e_req = err.request
        if e_req:
            self.request_url = str(e_req.url)
            self.request_method = e_req.method

        self.errors = None
        self.message = str(err)

        try:  # ruff:ignore[too-many-statements-in-try-clause]
            res_data = e_res.json()

            if isinstance(res_data, dict):
                if isinstance(res_data.get("errors"), dict):
                    self.errors = res_data["errors"]

                if (
                    isinstance(res_data.get("message"), str)
                    and res_data["message"].strip()
                ):
                    self.message = res_data["message"].strip()

        except json.JSONDecodeError:
            pass  # Keep self.message as-is

        super().__init__()

    def __str__(self) -> str:
        lines = [
            "\nDevopness SDK Error: API Request Failed\n",
        ]

        if self.request_method and self.request_url:
            lines.append(f"Request: {self.request_method} {self.request_url}")

        lines.extend(
            [
                f"Status Code: {self.status_code}",
                f"Message: {self.message}",
            ]
        )

        if self.errors:
            lines.append("Errors:")

            for field, field_errors in self.errors.items():
                lines.append(f"  - {field}:")

                for error in self._format_error_values(field_errors):
                    lines.append(f"      {error}")

        return "\n".join(lines)

    @staticmethod
    def _format_error_values(value: object) -> list[str]:
        if isinstance(value, dict):
            return [json.dumps(value, ensure_ascii=False)]

        if isinstance(value, (list, tuple, set)):
            formatted_values: list[str] = []

            for item in value:
                formatted_values.extend(DevopnessApiError._format_error_values(item))

            return formatted_values or [""]

        return [str(value)]


async def raise_devopness_api_error(err: httpx.HTTPStatusError) -> None:
    """
    Raise a DevopnessApiError exception from an HTTP Status Error.

    If the error's response body is not yet read, this function will read it to
    provide more details in the raised exception.

    The original exception is preserved as the `__cause__` attribute of the new
    exception.
    """
    try:
        await err.response.aread()
    except httpx.ReadError:
        # The response was already read
        contextlib.suppress(httpx.ReadError)

    raise DevopnessApiError(err) from err


def raise_devopness_api_error_sync(err: httpx.HTTPStatusError) -> None:
    """
    Raise a DevopnessApiError exception from an HTTP Status Error.

    If the error's response body is not yet read, this function will read it to
    provide more details in the raised exception.

    The original exception is preserved as the `__cause__` attribute of the new
    exception.
    """
    try:
        err.response.read()
    except httpx.ReadError:
        # The response was already read
        contextlib.suppress(httpx.ReadError)

    raise DevopnessApiError(err) from err
