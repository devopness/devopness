"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from typing import Generic, Optional, Type, TypeVar
from urllib.parse import parse_qs, urlparse
from warnings import warn

import httpx

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
        model_cls: Optional[Type[T]] = None,
    ) -> None:
        """
        Initialize an ApiResponse object from an httpx.Response.

        Args:
            response (httpx.Response): The HTTP response to wrap.
            model_cls (Optional[Type[T]]): Optional model class to deserialize
                                           the response body into.
        """
        self.status = response.status_code
        self.data = self._parse_data(response, model_cls)
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
        model_cls: Optional[Type[T]],
    ) -> T:
        """
        Parse the response data into the specified model class.

        Args:
            response (httpx.Response): The HTTP response object.
            model_cls (Optional[Type[T]]): The model class to deserialize
                                           the response body into.

        Returns:
            T: The parsed data.
        """
        raw_data: bytes = response.read()

        try:
            if not model_cls:
                return dict(raw_data)  # type: ignore

            return model_cls.from_json(raw_data)  # type: ignore

        # pylint: disable=bare-except
        # pylint: disable=broad-exception-caught
        except Exception:  # noqa: E722
            class_name = getattr(model_cls, "__name__", "Unknown")
            message = f"Failed to deserialize response body into {class_name}."
            message += " Returning raw response data instead."

            warn(message)
            return raw_data  # type: ignore
