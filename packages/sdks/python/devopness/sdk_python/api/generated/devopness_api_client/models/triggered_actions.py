# coding: utf-8

"""
    devopness API

    Devopness API - Painless essential DevOps to everyone 

    The version of the OpenAPI document: latest
    Generated by OpenAPI Generator (https://openapi-generator.tech)

    Do not edit the class manually.
"""  # noqa: E501


from __future__ import annotations
import pprint
import re  # noqa: F401
import json

from pydantic import BaseModel, ConfigDict
from typing import Any, ClassVar, Dict, List, Optional
from devopness_api_client.models.triggered_action_stats import TriggeredActionStats
from devopness_api_client.models.triggered_action_summary import TriggeredActionSummary
from typing import Optional, Set
from typing_extensions import Self

class TriggeredActions(BaseModel):
    """
    TriggeredActions
    """ # noqa: E501
    summary: Optional[TriggeredActionSummary] = None
    operations: Optional[List[TriggeredActionStats]] = None
    __properties: ClassVar[List[str]] = ["summary", "operations"]

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
        """Create an instance of TriggeredActions from a JSON string"""
        return cls.from_dict(json.loads(json_str))

    def to_dict(self) -> Dict[str, Any]:
        """Return the dictionary representation of the model using alias.

        This has the following differences from calling pydantic's
        `self.model_dump(by_alias=True)`:

        * `None` is only added to the output dict for nullable fields that
          were set at model initialization. Other fields with value `None`
          are ignored.
        """
        excluded_fields: Set[str] = set([
        ])

        _dict = self.model_dump(
            by_alias=True,
            exclude=excluded_fields,
            exclude_none=True,
        )
        # override the default output from pydantic by calling `to_dict()` of summary
        if self.summary:
            _dict['summary'] = self.summary.to_dict()
        # override the default output from pydantic by calling `to_dict()` of each item in operations (list)
        _items = []
        if self.operations:
            for _item_operations in self.operations:
                if _item_operations:
                    _items.append(_item_operations.to_dict())
            _dict['operations'] = _items
        return _dict

    @classmethod
    def from_dict(cls, obj: Optional[Dict[str, Any]]) -> Optional[Self]:
        """Create an instance of TriggeredActions from a dict"""
        if obj is None:
            return None

        if not isinstance(obj, dict):
            return cls.model_validate(obj)

        _obj = cls.model_validate({
            "summary": TriggeredActionSummary.from_dict(obj["summary"]) if obj.get("summary") is not None else None,
            "operations": [TriggeredActionStats.from_dict(_item) for _item in obj["operations"]] if obj.get("operations") is not None else None
        })
        return _obj


