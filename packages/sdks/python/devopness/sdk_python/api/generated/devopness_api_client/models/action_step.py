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

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, StrictInt, StrictStr
from typing import Any, ClassVar, Dict, List, Optional
from devopness_api_client.models.action_status import ActionStatus
from devopness_api_client.models.action_status_reason_code import ActionStatusReasonCode
from typing import Optional, Set
from typing_extensions import Self

class ActionStep(BaseModel):
    """
    Action step executed on server
    """ # noqa: E501
    id: StrictInt = Field(description="The unique id of the action step")
    action_id: StrictInt = Field(description="The unique id of the action linked to this step")
    action_target_id: StrictInt = Field(description="The unique id of the action target linked to this step")
    name: Optional[StrictStr] = Field(description="Name of the action describing your purpose")
    description: Optional[StrictStr] = Field(default=None, description="A short text describing the command. Can be helpful for other team members to understand why a pipeline step is needed.")
    order: StrictInt = Field(description="The execution order of the given step")
    status: ActionStatus
    status_human_readable: Optional[StrictStr] = Field(default=None, description="Human readable version of the action status")
    status_reason_code: Optional[ActionStatusReasonCode] = None
    status_reason_human_readable: Optional[StrictStr] = Field(default=None, description="Human readable version of the status reason code")
    started_at: Optional[datetime] = Field(default=None, description="The date and time when the action started execution (i.e., left the `pending/queued` status)")
    completed_at: Optional[datetime] = Field(default=None, description="The date and time when the action has finished execution")
    created_at: Optional[datetime] = Field(default=None, description="The date and time when the record was created")
    updated_at: Optional[datetime] = Field(default=None, description="The date and time when the record was last updated")
    __properties: ClassVar[List[str]] = ["id", "action_id", "action_target_id", "name", "description", "order", "status", "status_human_readable", "status_reason_code", "status_reason_human_readable", "started_at", "completed_at", "created_at", "updated_at"]

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
        """Create an instance of ActionStep from a JSON string"""
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
        # set to None if name (nullable) is None
        # and model_fields_set contains the field
        if self.name is None and "name" in self.model_fields_set:
            _dict['name'] = None

        # set to None if description (nullable) is None
        # and model_fields_set contains the field
        if self.description is None and "description" in self.model_fields_set:
            _dict['description'] = None

        # set to None if started_at (nullable) is None
        # and model_fields_set contains the field
        if self.started_at is None and "started_at" in self.model_fields_set:
            _dict['started_at'] = None

        # set to None if completed_at (nullable) is None
        # and model_fields_set contains the field
        if self.completed_at is None and "completed_at" in self.model_fields_set:
            _dict['completed_at'] = None

        return _dict

    @classmethod
    def from_dict(cls, obj: Optional[Dict[str, Any]]) -> Optional[Self]:
        """Create an instance of ActionStep from a dict"""
        if obj is None:
            return None

        if not isinstance(obj, dict):
            return cls.model_validate(obj)

        _obj = cls.model_validate({
            "id": obj.get("id"),
            "action_id": obj.get("action_id"),
            "action_target_id": obj.get("action_target_id"),
            "name": obj.get("name"),
            "description": obj.get("description"),
            "order": obj.get("order"),
            "status": obj.get("status"),
            "status_human_readable": obj.get("status_human_readable"),
            "status_reason_code": obj.get("status_reason_code"),
            "status_reason_human_readable": obj.get("status_reason_human_readable"),
            "started_at": obj.get("started_at"),
            "completed_at": obj.get("completed_at"),
            "created_at": obj.get("created_at"),
            "updated_at": obj.get("updated_at")
        })
        return _obj


