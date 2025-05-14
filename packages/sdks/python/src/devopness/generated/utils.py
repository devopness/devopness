"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from typing import Any
from urllib.parse import urlencode


def parse_query_string(in_params: dict[str, Any]) -> str:
    """
    Returns the query string from the given query parameters.

    Args:
        in_params (dict[str, Any]): The query parameters.

    Returns:
        str: The query string.
    """
    out_params: dict[str, Any] = {}
    for key, value in in_params.items():
        if value is None or value in ("", [], {}):
            continue

        out_params[key] = value

    return urlencode(out_params)
