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
from typing import Any, ClassVar, Dict, List
from devopness_api_client.models.language_runtime_engine_versions_inner import LanguageRuntimeEngineVersionsInner
from devopness_api_client.models.language_runtime_framework import LanguageRuntimeFramework
from typing import Optional, Set
from typing_extensions import Self

class LanguageRuntime(BaseModel):
    """
    LanguageRuntime
    """ # noqa: E501
    name: StrictStr = Field(description="The internal name/code of the language runtime")
    name_human_readable: StrictStr = Field(description="The formatted name to be displayed in user interfaces")
    engine_versions: List[LanguageRuntimeEngineVersionsInner] = Field(description="The list of the supported versions of the runtime engine")
    frameworks: List[LanguageRuntimeFramework] = Field(description="The list of supported frameworks built on top of the runtime engine")
    __properties: ClassVar[List[str]] = ["name", "name_human_readable", "engine_versions", "frameworks"]

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
        """Create an instance of LanguageRuntime from a JSON string"""
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
        # override the default output from pydantic by calling `to_dict()` of each item in engine_versions (list)
        _items = []
        if self.engine_versions:
            for _item_engine_versions in self.engine_versions:
                if _item_engine_versions:
                    _items.append(_item_engine_versions.to_dict())
            _dict['engine_versions'] = _items
        # override the default output from pydantic by calling `to_dict()` of each item in frameworks (list)
        _items = []
        if self.frameworks:
            for _item_frameworks in self.frameworks:
                if _item_frameworks:
                    _items.append(_item_frameworks.to_dict())
            _dict['frameworks'] = _items
        return _dict

    @classmethod
    def from_dict(cls, obj: Optional[Dict[str, Any]]) -> Optional[Self]:
        """Create an instance of LanguageRuntime from a dict"""
        if obj is None:
            return None

        if not isinstance(obj, dict):
            return cls.model_validate(obj)

        _obj = cls.model_validate({
            "name": obj.get("name"),
            "name_human_readable": obj.get("name_human_readable"),
            "engine_versions": [LanguageRuntimeEngineVersionsInner.from_dict(_item) for _item in obj["engine_versions"]] if obj.get("engine_versions") is not None else None,
            "frameworks": [LanguageRuntimeFramework.from_dict(_item) for _item in obj["frameworks"]] if obj.get("frameworks") is not None else None
        })
        return _obj


