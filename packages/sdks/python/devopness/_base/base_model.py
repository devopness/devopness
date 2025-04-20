"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from typing import Self

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

    @classmethod
    def from_json(cls, data: str) -> Self:
        """
        Create an instance of the model from a JSON string.

        Args:
            data (str): A JSON string representing the model.

        Returns:
            Self: An instance of the model.
        """
        obj = from_json(data, allow_partial=True)
        model = cls.model_validate(obj)

        return model
