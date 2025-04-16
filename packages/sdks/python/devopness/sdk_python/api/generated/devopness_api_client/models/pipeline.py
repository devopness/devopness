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

from pydantic import BaseModel, ConfigDict, Field, StrictInt, StrictStr
from typing import Any, ClassVar, Dict, List, Optional
from devopness_api_client.models.pipeline_trigger_when import PipelineTriggerWhen
from devopness_api_client.models.resource_type import ResourceType
from devopness_api_client.models.step import Step
from devopness_api_client.models.user_relation import UserRelation
from typing import Optional, Set
from typing_extensions import Self

class Pipeline(BaseModel):
    """
    Pipeline
    """ # noqa: E501
    id: StrictInt = Field(description="The unique ID of the given pipeline")
    name: StrictStr = Field(description="The pipeline's name")
    environment_id: StrictInt = Field(description="ID of the environment this pipeline belongs to")
    project_id: StrictInt = Field(description="ID of the project this pipeline belongs to")
    resource_type: ResourceType
    resource_type_human_readable: StrictStr = Field(description="Human readable version of the resource type")
    resource_id: StrictInt = Field(description="The pipeline's resource ID")
    operation: StrictStr = Field(description="The resource operation associated to the pipeline.")
    operation_human_readable: StrictStr = Field(description="Human readable version of the operation")
    max_parallel_actions: StrictInt = Field(description="Maximum number of actions that can run in parallel for this pipeline. `0` means no limit of simultaneous actions. `1` means just a single action will be started at a time to run this pipeline.")
    trigger_when: Optional[PipelineTriggerWhen]
    steps: List[Step]
    created_by_user: UserRelation
    created_at: StrictStr = Field(description="The date and time when the record was created")
    updated_at: StrictStr = Field(description="The date and time when the record was last updated")
    __properties: ClassVar[List[str]] = ["id", "name", "environment_id", "project_id", "resource_type", "resource_type_human_readable", "resource_id", "operation", "operation_human_readable", "max_parallel_actions", "trigger_when", "steps", "created_by_user", "created_at", "updated_at"]

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
        """Create an instance of Pipeline from a JSON string"""
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
        # override the default output from pydantic by calling `to_dict()` of trigger_when
        if self.trigger_when:
            _dict['trigger_when'] = self.trigger_when.to_dict()
        # override the default output from pydantic by calling `to_dict()` of each item in steps (list)
        _items = []
        if self.steps:
            for _item_steps in self.steps:
                if _item_steps:
                    _items.append(_item_steps.to_dict())
            _dict['steps'] = _items
        # override the default output from pydantic by calling `to_dict()` of created_by_user
        if self.created_by_user:
            _dict['created_by_user'] = self.created_by_user.to_dict()
        # set to None if trigger_when (nullable) is None
        # and model_fields_set contains the field
        if self.trigger_when is None and "trigger_when" in self.model_fields_set:
            _dict['trigger_when'] = None

        return _dict

    @classmethod
    def from_dict(cls, obj: Optional[Dict[str, Any]]) -> Optional[Self]:
        """Create an instance of Pipeline from a dict"""
        if obj is None:
            return None

        if not isinstance(obj, dict):
            return cls.model_validate(obj)

        _obj = cls.model_validate({
            "id": obj.get("id"),
            "name": obj.get("name"),
            "environment_id": obj.get("environment_id"),
            "project_id": obj.get("project_id"),
            "resource_type": obj.get("resource_type"),
            "resource_type_human_readable": obj.get("resource_type_human_readable"),
            "resource_id": obj.get("resource_id"),
            "operation": obj.get("operation"),
            "operation_human_readable": obj.get("operation_human_readable"),
            "max_parallel_actions": obj.get("max_parallel_actions"),
            "trigger_when": PipelineTriggerWhen.from_dict(obj["trigger_when"]) if obj.get("trigger_when") is not None else None,
            "steps": [Step.from_dict(_item) for _item in obj["steps"]] if obj.get("steps") is not None else None,
            "created_by_user": UserRelation.from_dict(obj["created_by_user"]) if obj.get("created_by_user") is not None else None,
            "created_at": obj.get("created_at"),
            "updated_at": obj.get("updated_at")
        })
        return _obj


