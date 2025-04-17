"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from typing import Generic, TypeVar, Optional, Type
from urllib.parse import parse_qs, urlparse

import httpx

T = TypeVar("T")


class ApiResponse(Generic[T]):
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
        self.status: int = response.status_code

        raw_data = response.json()
        self.data = model_cls.from_dict(raw_data) if model_cls else raw_data  # type: ignore

        self.page_count: int = self._extract_last_page_number(
            response.headers.get("link", "")
        )

        self.action_id: Optional[int] = self._parse_action_id(
            response.headers.get("x-devopness-action-id")
        )

    def _extract_last_page_number(self, link_header: str) -> int:
        """
        Extract the last page number from a pagination Link header.

        Args:
            link_header (str): The 'Link' header from the HTTP response.

        Returns:
            int: The number of the last page, or 1 if it could not
                  be determined.
        """
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

    def _parse_action_id(
        self,
        action_id_header: Optional[str],
    ) -> Optional[int]:
        """
        Parse the 'x-devopness-action-id' header into an integer.

        Args:
            action_id_header (Optional[str]): The value of the action
                                              ID header.

        Returns:
            Optional[int]: The parsed action ID, or None if invalid.
        """
        try:
            return int(action_id_header) if action_id_header else None
        except ValueError:
            return None
