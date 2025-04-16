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

from pydantic import BaseModel, ConfigDict, Field, StrictStr
from typing import Any, ClassVar, Dict, List, Optional
from devopness_api_client.models.cloud_provider_service_code import CloudProviderServiceCode
from devopness_api_client.models.cloud_provider_service_region import CloudProviderServiceRegion
from devopness_api_client.models.cloud_provider_service_resource_type import CloudProviderServiceResourceType
from devopness_api_client.models.provider_relation import ProviderRelation
from typing import Optional, Set
from typing_extensions import Self

class CloudProviderService(BaseModel):
    """
    CloudProviderService
    """ # noqa: E501
    code: CloudProviderServiceCode
    name: StrictStr = Field(description="The full name of the cloud service")
    provider: Optional[ProviderRelation] = None
    regions: Optional[List[CloudProviderServiceRegion]] = None
    resource_types: Optional[List[CloudProviderServiceResourceType]] = None
    __properties: ClassVar[List[str]] = ["code", "name", "provider", "regions", "resource_types"]

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
        """Create an instance of CloudProviderService from a JSON string"""
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
        # override the default output from pydantic by calling `to_dict()` of provider
        if self.provider:
            _dict['provider'] = self.provider.to_dict()
        # override the default output from pydantic by calling `to_dict()` of each item in regions (list)
        _items = []
        if self.regions:
            for _item_regions in self.regions:
                if _item_regions:
                    _items.append(_item_regions.to_dict())
            _dict['regions'] = _items
        # override the default output from pydantic by calling `to_dict()` of each item in resource_types (list)
        _items = []
        if self.resource_types:
            for _item_resource_types in self.resource_types:
                if _item_resource_types:
                    _items.append(_item_resource_types.to_dict())
            _dict['resource_types'] = _items
        return _dict

    @classmethod
    def from_dict(cls, obj: Optional[Dict[str, Any]]) -> Optional[Self]:
        """Create an instance of CloudProviderService from a dict"""
        if obj is None:
            return None

        if not isinstance(obj, dict):
            return cls.model_validate(obj)

        _obj = cls.model_validate({
            "code": obj.get("code"),
            "name": obj.get("name"),
            "provider": ProviderRelation.from_dict(obj["provider"]) if obj.get("provider") is not None else None,
            "regions": [CloudProviderServiceRegion.from_dict(_item) for _item in obj["regions"]] if obj.get("regions") is not None else None,
            "resource_types": [CloudProviderServiceResourceType.from_dict(_item) for _item in obj["resource_types"]] if obj.get("resource_types") is not None else None
        })
        return _obj


