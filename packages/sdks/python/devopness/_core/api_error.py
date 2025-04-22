"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

import json
from typing import Optional

import httpx

from .sdk_error import DevopnessSdkError

__all__ = ["DevopnessApiError"]


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
    request_url: Optional[str] = None
    request_method: Optional[str] = None
    message: str
    errors: Optional[dict[str, list[str]]] = None

    def __init__(self, err: httpx.HTTPStatusError) -> None:
        e_res = err.response

        e_res.read()
        self.status_code = e_res.status_code
        self.response_text = e_res.text

        e_req = err.request
        if e_req:
            self.request_url = str(e_req.url)
            self.request_method = e_req.method

        self.errors = None
        self.message = str(err)

        try:
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

        lines.append(f"Status Code: {self.status_code}")
        lines.append(f"Message: {self.message}")

        if self.errors:
            lines.append("Errors:")

            for field, errors in self.errors.items():
                lines.append(f"  - {field}:")
                for error in errors:
                    lines.append(f"      {error}")

        return "\n".join(lines)
