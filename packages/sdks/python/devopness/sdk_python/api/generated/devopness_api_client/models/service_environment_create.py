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

from pydantic import BaseModel, ConfigDict, Field, StrictBool, StrictStr
from typing import Any, ClassVar, Dict, List, Optional
from devopness_api_client.models.resource_to_be_linked import ResourceToBeLinked
from devopness_api_client.models.service_initial_state import ServiceInitialState
from devopness_api_client.models.service_type import ServiceType
from typing import Optional, Set
from typing_extensions import Self

class ServiceEnvironmentCreate(BaseModel):
    """
    ServiceEnvironmentCreate
    """ # noqa: E501
    linked_resources: Optional[List[ResourceToBeLinked]] = Field(default=None, description="The resources to be linked with this resource")
    auto_start: Optional[StrictBool] = Field(default=None, description="Tells if the service should start automatically on operating system boot.")
    initial_state: Optional[ServiceInitialState] = ServiceInitialState.STARTED
    type: ServiceType
    version: StrictStr = Field(description="The service version to be installed. Must be at least 1 character. Must not be greater than 30 characters.")
    __properties: ClassVar[List[str]] = ["linked_resources", "auto_start", "initial_state", "type", "version"]

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
        """Create an instance of ServiceEnvironmentCreate from a JSON string"""
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
        # override the default output from pydantic by calling `to_dict()` of each item in linked_resources (list)
        _items = []
        if self.linked_resources:
            for _item_linked_resources in self.linked_resources:
                if _item_linked_resources:
                    _items.append(_item_linked_resources.to_dict())
            _dict['linked_resources'] = _items
        return _dict

    @classmethod
    def from_dict(cls, obj: Optional[Dict[str, Any]]) -> Optional[Self]:
        """Create an instance of ServiceEnvironmentCreate from a dict"""
        if obj is None:
            return None

        if not isinstance(obj, dict):
            return cls.model_validate(obj)

        _obj = cls.model_validate({
            "linked_resources": [ResourceToBeLinked.from_dict(_item) for _item in obj["linked_resources"]] if obj.get("linked_resources") is not None else None,
            "auto_start": obj.get("auto_start"),
            "initial_state": obj.get("initial_state") if obj.get("initial_state") is not None else ServiceInitialState.STARTED,
            "type": obj.get("type"),
            "version": obj.get("version")
        })
        return _obj


