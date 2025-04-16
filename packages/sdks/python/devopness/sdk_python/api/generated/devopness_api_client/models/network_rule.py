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
from devopness_api_client.models.action_relation import ActionRelation
from devopness_api_client.models.environment_relation import EnvironmentRelation
from devopness_api_client.models.network_rule_direction import NetworkRuleDirection
from devopness_api_client.models.network_rule_protocol import NetworkRuleProtocol
from devopness_api_client.models.server_relation import ServerRelation
from devopness_api_client.models.user_relation import UserRelation
from typing import Optional, Set
from typing_extensions import Self

class NetworkRule(BaseModel):
    """
    NetworkRule
    """ # noqa: E501
    id: StrictInt = Field(description="The ID of the given network rule")
    name: StrictStr = Field(description="The rule's name/description/reminder")
    direction: NetworkRuleDirection
    protocol: NetworkRuleProtocol
    port: StrictInt = Field(description="Network port to be considered by this rule")
    cidr_block: StrictStr = Field(description="IP address range this rule applies for, defined using CIDR notation")
    is_auto_generated: StrictBool = Field(description="Indicates if the network rule was auto_generated by `Devopness` itself")
    last_action: Optional[ActionRelation]
    created_by_user: UserRelation
    environment: Optional[EnvironmentRelation]
    servers: List[Optional[ServerRelation]]
    created_at: StrictStr = Field(description="The date and time when the record was created")
    updated_at: StrictStr = Field(description="The date and time when the record was last updated")
    __properties: ClassVar[List[str]] = ["id", "name", "direction", "protocol", "port", "cidr_block", "is_auto_generated", "last_action", "created_by_user", "environment", "servers", "created_at", "updated_at"]

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
        """Create an instance of NetworkRule from a JSON string"""
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
        # override the default output from pydantic by calling `to_dict()` of last_action
        if self.last_action:
            _dict['last_action'] = self.last_action.to_dict()
        # override the default output from pydantic by calling `to_dict()` of created_by_user
        if self.created_by_user:
            _dict['created_by_user'] = self.created_by_user.to_dict()
        # override the default output from pydantic by calling `to_dict()` of environment
        if self.environment:
            _dict['environment'] = self.environment.to_dict()
        # override the default output from pydantic by calling `to_dict()` of each item in servers (list)
        _items = []
        if self.servers:
            for _item_servers in self.servers:
                if _item_servers:
                    _items.append(_item_servers.to_dict())
            _dict['servers'] = _items
        # set to None if last_action (nullable) is None
        # and model_fields_set contains the field
        if self.last_action is None and "last_action" in self.model_fields_set:
            _dict['last_action'] = None

        # set to None if environment (nullable) is None
        # and model_fields_set contains the field
        if self.environment is None and "environment" in self.model_fields_set:
            _dict['environment'] = None

        return _dict

    @classmethod
    def from_dict(cls, obj: Optional[Dict[str, Any]]) -> Optional[Self]:
        """Create an instance of NetworkRule from a dict"""
        if obj is None:
            return None

        if not isinstance(obj, dict):
            return cls.model_validate(obj)

        _obj = cls.model_validate({
            "id": obj.get("id"),
            "name": obj.get("name"),
            "direction": obj.get("direction"),
            "protocol": obj.get("protocol"),
            "port": obj.get("port"),
            "cidr_block": obj.get("cidr_block"),
            "is_auto_generated": obj.get("is_auto_generated"),
            "last_action": ActionRelation.from_dict(obj["last_action"]) if obj.get("last_action") is not None else None,
            "created_by_user": UserRelation.from_dict(obj["created_by_user"]) if obj.get("created_by_user") is not None else None,
            "environment": EnvironmentRelation.from_dict(obj["environment"]) if obj.get("environment") is not None else None,
            "servers": [ServerRelation.from_dict(_item) for _item in obj["servers"]] if obj.get("servers") is not None else None,
            "created_at": obj.get("created_at"),
            "updated_at": obj.get("updated_at")
        })
        return _obj


