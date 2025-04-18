"""
Devopness API Python SDK - Painless essential DevOps to everyone

Note:
    This is auto generated by OpenAPI Generator.
    https://openapi-generator.tech
"""

from __future__ import annotations
import pprint
import re  # noqa: F401
import json

from pydantic import BaseModel, ConfigDict, Field, StrictFloat, StrictInt
from typing import Any, ClassVar, Dict, List, Optional, Union
from typing import Optional, Set
from typing_extensions import Self


class TriggeredActionSummary(BaseModel):
    """
    Summary of actions that were triggered by the user

    Attributes:
        count (float, optional): Total of actions that were triggered by the user
        queued (float, optional): Total of actions that were triggered by the user with status queued
        pending (float, optional): Total of actions that were triggered by the user with status pending
        in_progress (float, optional): Total of actions that were triggered by the user with status in_progress
        completed (float, optional): Total of actions that were triggered by the user with status completed
        failed (float, optional): Total of actions that were triggered by the user with status failed
    """

    count: Optional[Union[StrictFloat, StrictInt]] = Field(
        default=None, description="Total of actions that were triggered by the user"
    )
    queued: Optional[Union[StrictFloat, StrictInt]] = Field(
        default=None,
        description="Total of actions that were triggered by the user with status queued",
    )
    pending: Optional[Union[StrictFloat, StrictInt]] = Field(
        default=None,
        description="Total of actions that were triggered by the user with status pending",
    )
    in_progress: Optional[Union[StrictFloat, StrictInt]] = Field(
        default=None,
        description="Total of actions that were triggered by the user with status in_progress",
    )
    completed: Optional[Union[StrictFloat, StrictInt]] = Field(
        default=None,
        description="Total of actions that were triggered by the user with status completed",
    )
    failed: Optional[Union[StrictFloat, StrictInt]] = Field(
        default=None,
        description="Total of actions that were triggered by the user with status failed",
    )
    __properties: ClassVar[List[str]] = [
        "count",
        "queued",
        "pending",
        "in_progress",
        "completed",
        "failed",
    ]

    model_config = ConfigDict(
        populate_by_name=True,
        validate_assignment=True,
        protected_namespaces=(),
    )

    def to_str(self) -> str:
        """Returns the string representation of the model using alias"""
        return pprint.pformat(self.model_dump(by_alias=True))

    def to_json(self) -> str:
        """Returns the JSON representation of the model using alias"""
        # TODO: pydantic v2: use .model_dump_json(by_alias=True, exclude_unset=True) instead
        return json.dumps(self.to_dict())

    @classmethod
    def from_json(cls, json_str: str) -> Optional[Self]:
        """Create an instance of TriggeredActionSummary from a JSON string"""
        return cls.from_dict(json.loads(json_str))

    def to_dict(self) -> Dict[str, Any]:
        """Return the dictionary representation of the model using alias.

        This has the following differences from calling pydantic's
        `self.model_dump(by_alias=True)`:

        * `None` is only added to the output dict for nullable fields that
          were set at model initialization. Other fields with value `None`
          are ignored.
        """
        excluded_fields: Set[str] = set([])

        _dict = self.model_dump(
            by_alias=True,
            exclude=excluded_fields,
            exclude_none=True,
        )
        return _dict

    @classmethod
    def from_dict(cls, obj: Optional[Dict[str, Any]]) -> Optional[Self]:
        """Create an instance of TriggeredActionSummary from a dict"""
        if obj is None:
            return None

        if not isinstance(obj, dict):
            return cls.model_validate(obj)

        _obj = cls.model_validate(
            {
                "count": obj.get("count"),
                "queued": obj.get("queued"),
                "pending": obj.get("pending"),
                "in_progress": obj.get("in_progress"),
                "completed": obj.get("completed"),
                "failed": obj.get("failed"),
            }
        )
        return _obj
