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

from pydantic import BaseModel, ConfigDict, Field, StrictBool, StrictInt, StrictStr
from typing import Any, ClassVar, Dict, List, Optional
from devopness_api_client.models.action_type import ActionType
from devopness_api_client.models.hook_settings import HookSettings
from devopness_api_client.models.hook_trigger_when import HookTriggerWhen
from devopness_api_client.models.hook_type import HookType
from devopness_api_client.models.resource_type import ResourceType
from typing import Optional, Set
from typing_extensions import Self

class HookRelation(BaseModel):
    """
    HookRelation
    """ # noqa: E501
    id: StrictStr = Field(description="The UUID of the given hook")
    name: StrictStr = Field(description="The name entered by the user (or auto-generated by `Devopness`) to uniquely identify the hook")
    type: HookType
    action_type: ActionType
    url: Optional[StrictStr] = Field(description="URL that triggers incoming hooks")
    target_url: Optional[StrictStr] = Field(description="URL that outgoing hooks make a request to")
    is_auto_generated: StrictBool = Field(description="Indicates if the record was auto_generated by `Devopness` itself")
    requires_secret: StrictBool = Field(description="Tells if requests to this hook must only be accepted when a HTTP header is sent with a message authentication code ([HMAC](https://en.wikipedia.org/wiki/HMAC)) generated based on the secret provided by Devopness and shared by user with external sources")
    verify_ssl: StrictBool = Field(description="Indicates if the Devopness must be verify the SSL certificate of the request")
    active: StrictBool = Field(description="Determines if the hook is currently active")
    project_id: StrictInt = Field(description="The ID of the project")
    environment_id: StrictInt = Field(description="The ID of the environment")
    pipeline_id: Optional[StrictInt] = Field(description="The ID of the pipeline executed by this hook")
    resource_type: ResourceType
    resource_id: StrictInt = Field(description="The hooks' resource ID")
    settings: Optional[HookSettings]
    trigger_when: HookTriggerWhen
    created_at: StrictStr = Field(description="The date and time when the record was created")
    updated_at: StrictStr = Field(description="The date and time when the record was last updated")
    __properties: ClassVar[List[str]] = ["id", "name", "type", "action_type", "url", "target_url", "is_auto_generated", "requires_secret", "verify_ssl", "active", "project_id", "environment_id", "pipeline_id", "resource_type", "resource_id", "settings", "trigger_when", "created_at", "updated_at"]

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
        """Create an instance of HookRelation from a JSON string"""
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
        # override the default output from pydantic by calling `to_dict()` of settings
        if self.settings:
            _dict['settings'] = self.settings.to_dict()
        # override the default output from pydantic by calling `to_dict()` of trigger_when
        if self.trigger_when:
            _dict['trigger_when'] = self.trigger_when.to_dict()
        # set to None if url (nullable) is None
        # and model_fields_set contains the field
        if self.url is None and "url" in self.model_fields_set:
            _dict['url'] = None

        # set to None if target_url (nullable) is None
        # and model_fields_set contains the field
        if self.target_url is None and "target_url" in self.model_fields_set:
            _dict['target_url'] = None

        # set to None if pipeline_id (nullable) is None
        # and model_fields_set contains the field
        if self.pipeline_id is None and "pipeline_id" in self.model_fields_set:
            _dict['pipeline_id'] = None

        # set to None if settings (nullable) is None
        # and model_fields_set contains the field
        if self.settings is None and "settings" in self.model_fields_set:
            _dict['settings'] = None

        return _dict

    @classmethod
    def from_dict(cls, obj: Optional[Dict[str, Any]]) -> Optional[Self]:
        """Create an instance of HookRelation from a dict"""
        if obj is None:
            return None

        if not isinstance(obj, dict):
            return cls.model_validate(obj)

        _obj = cls.model_validate({
            "id": obj.get("id"),
            "name": obj.get("name"),
            "type": obj.get("type"),
            "action_type": obj.get("action_type"),
            "url": obj.get("url"),
            "target_url": obj.get("target_url"),
            "is_auto_generated": obj.get("is_auto_generated"),
            "requires_secret": obj.get("requires_secret"),
            "verify_ssl": obj.get("verify_ssl"),
            "active": obj.get("active"),
            "project_id": obj.get("project_id"),
            "environment_id": obj.get("environment_id"),
            "pipeline_id": obj.get("pipeline_id"),
            "resource_type": obj.get("resource_type"),
            "resource_id": obj.get("resource_id"),
            "settings": HookSettings.from_dict(obj["settings"]) if obj.get("settings") is not None else None,
            "trigger_when": HookTriggerWhen.from_dict(obj["trigger_when"]) if obj.get("trigger_when") is not None else None,
            "created_at": obj.get("created_at"),
            "updated_at": obj.get("updated_at")
        })
        return _obj


