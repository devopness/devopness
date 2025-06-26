"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

import json
from typing import Any, Generic, Optional, TypeVar, Union, cast, get_args, get_origin
from urllib.parse import parse_qs, urlparse
from warnings import warn

import httpx
from pydantic import ValidationError

from devopness.base import DevopnessBaseModel

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
        self.data = cast(T, self._parse_data(response, model_cls))
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

    def _parse_data(
        self,
        response: httpx.Response,
        model_cls: Optional[Union[type[DevopnessBaseModel], type]],
    ) -> Union[
        str,
        int,
        float,
        DevopnessBaseModel,
        list[DevopnessBaseModel],
        dict[str, Any],
        None,
    ]:
        """
        Parse the response data into the specified model class.

        Parameters:
            response: The HTTP response to parse
            model_cls: The target model class to convert the data into

        Returns:
            Parsed data in the requested format or raw string on failure
        """
        # Early return conditions
        raw_data: bytes = response.read()
        if raw_data == b"" or model_cls is None:
            return None

        try:
            # Handle primitive types
            if model_cls is str:
                return raw_data.decode("utf-8")

            if model_cls is int:
                return int(raw_data.decode("utf-8"))

            if model_cls is float:
                return float(raw_data.decode("utf-8"))

            # Handle collection types
            model_origin = get_origin(model_cls)

            # Handle list type
            if model_origin is list:
                model_args: tuple[type[DevopnessBaseModel], ...] = get_args(model_cls)
                if len(model_args) != 1:
                    raise NotImplementedError(
                        "Only lists with a single type argument are supported"
                    )

                list_data = json.loads(raw_data.decode("utf-8"))
                return [model_args[0].from_dict(item) for item in list_data]

            # Handle DevopnessBaseModel
            if issubclass(model_cls, DevopnessBaseModel):
                dict_data: dict[str, Any] = json.loads(raw_data.decode("utf-8"))
                return model_cls.from_dict(dict_data)

        except (json.JSONDecodeError, ValidationError) as e:
            model_name = model_cls.__name__ if model_cls else "None"
            msg = (
                f"Failed to deserialize response body into {model_name}. "
                "Returning raw response data instead.\n\n"
                f"Error: {e}"
            )
            warn(msg, stacklevel=3)

        # Fallback to raw string data
        return raw_data.decode("utf-8")
