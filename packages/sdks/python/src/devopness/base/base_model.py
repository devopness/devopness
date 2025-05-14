"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from typing import Any, Self

from pydantic import BaseModel, ConfigDict
from pydantic_core import from_json

__all__ = ["DevopnessBaseModel"]


class DevopnessBaseModel(BaseModel):
    """
    Base model for Devopness Python SDK models.
    """

    model_config = ConfigDict(
        populate_by_name=True,
        validate_assignment=True,
        protected_namespaces=(),
    )

    def __getitem__(self, key: str) -> Any:  # noqa: ANN401
        return getattr(self, key)

    def __setitem__(self, key: str, value: Any) -> None:  # noqa: ANN401
        setattr(self, key, value)

    def __contains__(self, key: str) -> bool:
        return hasattr(self, key)

    @classmethod
    def from_dict(cls, data: Any) -> Self:  # noqa: ANN401
        """
        Create an instance of the model from a dictionary.

        Args:
            data (dict): A dictionary representing the model.

        Returns:
            Self: An instance of the model.
        """
        return cls.model_validate(data)

    def to_dict(self) -> dict[str, Any]:
        """
        Convert the model to a dictionary.

        Returns:
            dict (dict[str, Any]): A dictionary representing the model.
        """
        return self.model_dump()

    @classmethod
    def from_json(cls, data: str) -> Self:
        """
        Create an instance of the model from a JSON string.

        Args:
            data (str): A JSON string representing the model.

        Returns:
            Self: An instance of the model.
        """
        obj = from_json(data)
        return cls.model_validate(obj)

    def to_json(self) -> str:
        """
        Convert the model to a JSON string.

        Returns:
            str: A JSON string representing the model.
        """
        return self.model_dump_json()
