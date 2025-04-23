"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

import json
from typing import Generic, Optional, TypeVar, Union, get_args, get_origin
from urllib.parse import parse_qs, urlparse
from warnings import warn

import httpx

from devopness._base import DevopnessBaseModel

__all__ = ["DevopnessResponse"]

T = TypeVar("T")


class DevopnessResponse(Generic[T]):
    """
    Represents a typed API response from the Devopness API.

    Attributes:
        status (int): HTTP status code of the response.
        data (T): Parsed response body, optionally deserialized into a model.
        page_count (int): Total number of pages if pagination headers
                          are present.
        action_id (Optional[int]): Action ID extracted from the
                                   response headers (if available).
    """

    status: int
    data: T
    page_count: int
    action_id: Optional[int]

    def __init__(
        self,
        response: httpx.Response,
        model_cls: Optional[Union[type[DevopnessBaseModel], type]] = None,
    ) -> None:
        """
        Initialize an ApiResponse object from an httpx.Response.

        Args:
            response (httpx.Response): The HTTP response to wrap.
            model_cls (Optional[Union[type[DevopnessBaseModel], type]]):
                                                      Optional model to
                                                      deserialize the response
                                                      body into.
        """
        self.status = response.status_code
        self.data = self._parse_data(response, model_cls)  # type: ignore
        self.page_count = self._extract_last_page_number(response)
        self.action_id = self._parse_action_id(response)

    def _extract_last_page_number(self, response: httpx.Response) -> int:
        """
        Extract the last page number from a pagination Link header.

        Args:
            response (httpx.Response): The HTTP response object.

        Returns:
            int: The number of the last page, or 1 if it could not
                  be determined.
        """
        link_header = response.headers.get("link", "")

        for link in link_header.split(","):
            parts = [p.strip() for p in link.split(";")]
            if len(parts) < 2:
                continue

            url_part, rel_part = parts[0], parts[1]
            if rel_part == 'rel="last"':
                try:
                    url = urlparse(url_part.strip("<>"))
                    page_values = parse_qs(url.query).get("page")
                    return int(page_values[0]) if page_values else 1
                except (ValueError, IndexError):
                    return 1
        return 1

    def _parse_action_id(self, response: httpx.Response) -> Optional[int]:
        """
        Parse the 'x-devopness-action-id' header into an integer.

        Args:
            response (httpx.Response): The HTTP response object.

        Returns:
            Optional[int]: The parsed action ID, or None if invalid.
        """
        action_id_header = response.headers.get("x-devopness-action-id")

        try:
            return int(action_id_header) if action_id_header else None
        except ValueError:
            return None

    def _parse_data(  # noqa: ANN202
        self,
        response: httpx.Response,
        model_cls: Optional[Union[type[DevopnessBaseModel], type]],
    ):
        """
        Parse the response data into the specified model class.
        """
        raw_data: bytes = response.read()

        if model_cls is str:
            return raw_data.decode("utf-8")

        if model_cls is int:
            return int(raw_data.decode("utf-8"))

        if model_cls is float:
            return float(raw_data.decode("utf-8"))

        # No data to parse, just return None
        if raw_data == b"":
            return None

        try:
            # No model provided, just try decoding JSON as dict
            if not model_cls:
                return json.loads(raw_data)

            # Handle Union types (e.g., AnyOf or OneOf)
            if get_origin(model_cls) is Union:
                for model in get_args(model_cls):
                    try:
                        return model.from_json(raw_data)
                    except ValueError:
                        continue
                raise ValueError("No matching model found in Union")

            # Handle regular model class
            return model_cls.from_json(raw_data)  # type: ignore

        # pylint: disable=bare-except
        # pylint: disable=broad-exception-caught
        except:  # noqa: E722
            class_name = getattr(model_cls, "__name__", "Unknown")
            warn(
                f"Failed to deserialize response body into {class_name}. "
                "Returning raw response data instead.",
                stacklevel=2,
            )

            return json.loads(raw_data)
