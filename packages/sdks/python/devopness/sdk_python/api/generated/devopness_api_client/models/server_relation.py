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
from devopness_api_client.models.action_relation_shallow import ActionRelationShallow
from devopness_api_client.models.action_status import ActionStatus
from devopness_api_client.models.credential_relation import CredentialRelation
from typing import Optional, Set
from typing_extensions import Self

class ServerRelation(BaseModel):
    """
    ServerRelation
    """ # noqa: E501
    id: StrictInt = Field(description="The unique id of the given record")
    created_by: StrictInt = Field(description="The id of the user who created the server and to whom the server belongs")
    name: StrictStr = Field(description="The server's name")
    hostname: StrictStr = Field(description="The server's hostname")
    provider_name: StrictStr = Field(description="The name of the server's provider.")
    provider_name_human_readable: StrictStr = Field(description="The human readable version of the provider's name")
    credential: Optional[CredentialRelation]
    region: Optional[StrictStr] = Field(description="The region in which the server is located")
    region_human_readable: Optional[StrictStr] = Field(description="The human readable version of the region")
    ip_address: StrictStr = Field(description="Public ipv4 address for server access")
    ssh_port: StrictInt = Field(description="The network port to which the SSH daemon is listening to SSH connections on the server")
    active: StrictBool = Field(description="Tells if the server is active or not")
    status: ActionStatus
    last_action: Optional[ActionRelationShallow]
    created_at: StrictStr = Field(description="The date and time when the record was created")
    updated_at: StrictStr = Field(description="The date and time when the record was last updated")
    __properties: ClassVar[List[str]] = ["id", "created_by", "name", "hostname", "provider_name", "provider_name_human_readable", "credential", "region", "region_human_readable", "ip_address", "ssh_port", "active", "status", "last_action", "created_at", "updated_at"]

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
        """Create an instance of ServerRelation from a JSON string"""
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
        # override the default output from pydantic by calling `to_dict()` of credential
        if self.credential:
            _dict['credential'] = self.credential.to_dict()
        # override the default output from pydantic by calling `to_dict()` of last_action
        if self.last_action:
            _dict['last_action'] = self.last_action.to_dict()
        # set to None if credential (nullable) is None
        # and model_fields_set contains the field
        if self.credential is None and "credential" in self.model_fields_set:
            _dict['credential'] = None

        # set to None if region (nullable) is None
        # and model_fields_set contains the field
        if self.region is None and "region" in self.model_fields_set:
            _dict['region'] = None

        # set to None if region_human_readable (nullable) is None
        # and model_fields_set contains the field
        if self.region_human_readable is None and "region_human_readable" in self.model_fields_set:
            _dict['region_human_readable'] = None

        # set to None if last_action (nullable) is None
        # and model_fields_set contains the field
        if self.last_action is None and "last_action" in self.model_fields_set:
            _dict['last_action'] = None

        return _dict

    @classmethod
    def from_dict(cls, obj: Optional[Dict[str, Any]]) -> Optional[Self]:
        """Create an instance of ServerRelation from a dict"""
        if obj is None:
            return None

        if not isinstance(obj, dict):
            return cls.model_validate(obj)

        _obj = cls.model_validate({
            "id": obj.get("id"),
            "created_by": obj.get("created_by"),
            "name": obj.get("name"),
            "hostname": obj.get("hostname"),
            "provider_name": obj.get("provider_name"),
            "provider_name_human_readable": obj.get("provider_name_human_readable"),
            "credential": CredentialRelation.from_dict(obj["credential"]) if obj.get("credential") is not None else None,
            "region": obj.get("region"),
            "region_human_readable": obj.get("region_human_readable"),
            "ip_address": obj.get("ip_address"),
            "ssh_port": obj.get("ssh_port"),
            "active": obj.get("active"),
            "status": obj.get("status"),
            "last_action": ActionRelationShallow.from_dict(obj["last_action"]) if obj.get("last_action") is not None else None,
            "created_at": obj.get("created_at"),
            "updated_at": obj.get("updated_at")
        })
        return _obj


