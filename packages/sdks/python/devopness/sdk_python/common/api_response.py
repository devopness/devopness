"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from typing import Generic, TypeVar, Optional
from urllib.parse import parse_qs, urlparse

import httpx

T = TypeVar("T")


class ApiResponse(Generic[T]):
    """
    A class to represent an API response.

    Attributes:
        status (int): The HTTP status code of the response.
        data (T): The data extracted from the JSON response.
        page_count (int): The total number of pages if pagination is present.
        action_id (Optional[int]): The action ID from the response headers
                                   , if available.

    Methods:
        _extract_last_page_number(link_header: str) -> int:
            Extracts and returns the last page number from the pagination link
            header.
    """

    def __init__(self, response: httpx.Response):
        """
        Initializes an ApiResponse instance with the given httpx.Response.

        Args:
            response (httpx.Response): The HTTP response object from which to
                                       extract data.
        """
        self.status: int = response.status_code
        self.data: T = response.json()  # Assumes JSON response
        self.page_count: int = 1
        self.action_id: Optional[int] = None

        link_header = response.headers.get("link")
        if link_header:
            self.page_count = self._extract_last_page_number(link_header)

        action_id_header = response.headers.get("x-devopness-action-id")
        if action_id_header:
            try:
                self.action_id = int(action_id_header)
            except ValueError:
                pass

    def _extract_last_page_number(self, link_header: str) -> int:
        """
        Extracts the last page number from the link header if pagination is
        present.

        Args:
            link_header (str): The link header containing pagination
                               information.

        Returns:
            int: The last page number, or 1 if extraction fails.
        """
        for link in link_header.split(","):
            parts = link.split(";")
            if len(parts) < 2:
                continue
            url_part = parts[0].strip()[1:-1]  # remove '<' and '>'
            rel_part = parts[1].strip()
            if rel_part == 'rel="last"':
                query = urlparse(url_part).query
                page_values = parse_qs(query).get("page")
                if page_values:
                    try:
                        return int(page_values[0])
                    except ValueError:
                        return 1
        return 1
