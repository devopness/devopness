"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from typing import Any
from urllib.parse import urlencode

__all__ = [
    "parse_query_string",
]

QueryStringParam = Any


def parse_query_string(in_params: dict[str, QueryStringParam]) -> str:
    """
    Returns the query string from the given query parameters.

    Args:
        in_params (dict[str, QueryStringParam]): The query parameters.

    Returns:
        str: The query string.
    """
    out_params: dict[str, QueryStringParam] = {}

    for key, value in in_params.items():
        if _is_empty(value):
            continue

        if key == "filter":
            parsed_value = _parse_filter_query_string(value)
            out_params.update(parsed_value)

            continue

        out_params[key] = value

    return urlencode(out_params)


def _parse_filter_query_string(
    filter_param: QueryStringParam,
) -> dict[str, QueryStringParam]:
    """
    Returns the query string from the given filter parameters.

    Args:
        filter_param (QueryStringParam): The filter parameters.

    Returns:
        dict[str, QueryStringParam]: The filter query string parameters.
    """
    out_params: dict[str, QueryStringParam] = {}

    for key, value in dict(filter_param).items():
        if _is_empty(value):
            continue

        filter_key = f"filter[{key}]"
        filter_value = str(value)

        out_params[filter_key] = filter_value

    return out_params


def _is_empty(value: QueryStringParam) -> bool:
    """Return whether a query parameter value should be omitted."""
    return value is None or not value or value == [] or value == {}
