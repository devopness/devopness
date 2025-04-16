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
from typing import Any, ClassVar, Dict, List
from devopness_api_client.models.subnet_provision_input import SubnetProvisionInput
from devopness_api_client.models.subnet_type import SubnetType
from typing import Optional, Set
from typing_extensions import Self

class SubnetNetworkCreate(BaseModel):
    """
    SubnetNetworkCreate
    """ # noqa: E501
    name: StrictStr = Field(description="The subnet's name. Must be between 1 and 63 characters.")
    type: SubnetType
    provision_input: SubnetProvisionInput
    credential_id: StrictInt = Field(description="The ID of the cloud credential.")
    __properties: ClassVar[List[str]] = ["name", "type", "provision_input", "credential_id"]

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
        """Create an instance of SubnetNetworkCreate from a JSON string"""
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
        # override the default output from pydantic by calling `to_dict()` of provision_input
        if self.provision_input:
            _dict['provision_input'] = self.provision_input.to_dict()
        return _dict

    @classmethod
    def from_dict(cls, obj: Optional[Dict[str, Any]]) -> Optional[Self]:
        """Create an instance of SubnetNetworkCreate from a dict"""
        if obj is None:
            return None

        if not isinstance(obj, dict):
            return cls.model_validate(obj)

        _obj = cls.model_validate({
            "name": obj.get("name"),
            "type": obj.get("type"),
            "provision_input": SubnetProvisionInput.from_dict(obj["provision_input"]) if obj.get("provision_input") is not None else None,
            "credential_id": obj.get("credential_id")
        })
        return _obj


