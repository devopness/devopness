from typing import Any, Generic, List, Literal, Self, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class MCPResponse(BaseModel, Generic[T]):
    """
    Represents a response from the Devopness MCP Server.

    Args:
        data (T | None): The data to be sent as the response.
        status (Literal["ok", "warning", "error"]): The status of the response.
        instructions (List[Any]): Instructions to be sent to LLM.
    """

    data: T | None = None
    status: Literal["ok", "warning", "error"]
    instructions: List[Any]

    @classmethod
    def ok(cls, data: T | None = None, instructions: List[Any] | None = None) -> Self:
        """
        Create an MCP response with a status of "ok".

        Args:
            data (T | None): The data to be sent as the response.
            instructions (List[Any] | None): Instructions to be sent to LLM.

        Returns:
            Self: The created MCP response.
        """
        return cls(
            data=data,
            status="ok",
            instructions=instructions or [],
        )

    @classmethod
    def warning(cls, instructions: List[Any]) -> Self:
        """
        Create an MCP response with a status of "warning".

        Args:
            instructions (List[Any]): Instructions to be sent to LLM.

        Returns:
            Self: The created MCP response.
        """
        return cls(
            status="warning",
            instructions=instructions,
        )

    @classmethod
    def error(cls, instructions: List[Any] | None = None) -> Self:
        """
        Create an MCP response with a status of "error".

        Args:
            instructions (List[Any] | None): Instructions to be sent to LLM.

        Returns:
            Self: The created MCP response.
        """
        return cls(
            status="error",
            instructions=instructions or [],
        )
