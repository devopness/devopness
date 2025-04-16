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
from devopness_api_client.models.resource_to_be_linked import ResourceToBeLinked
from typing import Optional, Set
from typing_extensions import Self

class DaemonEnvironmentCreate(BaseModel):
    """
    DaemonEnvironmentCreate
    """ # noqa: E501
    linked_resources: Optional[List[ResourceToBeLinked]] = Field(default=None, description="The resources to be linked with this resource")
    command: StrictStr = Field(description="The command line to be executed to start the daemon. Must not be greater than 255 characters.")
    process_count: StrictInt = Field(description="The number of daemon process instances of the program to run simultaneously. Must be at least 1. Must not be greater than 99.")
    working_directory: Optional[StrictStr] = Field(description="The working directory where the Daemon command will be executed. If the Daemon is linked to an application, the path must be a relative path to the application root directory. If the Daemon is not linked to an application, the value must be an absolute path. Must start with one of <code>/</code> Must not be greater than 255 characters.")
    run_as_user: StrictStr = Field(description="The name of the Unix user on behalf of which the daemon will run. Must not be greater than 60 characters.")
    name: StrictStr = Field(description="The name entered by the user (or auto-generated by `devopness`) to uniquely identify the daemon. Must contain only letters, numbers, dashes and underscores. Must not be greater than 60 characters.")
    application_id: Optional[StrictInt] = Field(default=None, description="The ID of the application to be linked to the daemon. The value of `working_directory` will be relative to the application directory.")
    __properties: ClassVar[List[str]] = ["linked_resources", "command", "process_count", "working_directory", "run_as_user", "name", "application_id"]

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
        """Create an instance of DaemonEnvironmentCreate from a JSON string"""
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
        # set to None if working_directory (nullable) is None
        # and model_fields_set contains the field
        if self.working_directory is None and "working_directory" in self.model_fields_set:
            _dict['working_directory'] = None

        # set to None if application_id (nullable) is None
        # and model_fields_set contains the field
        if self.application_id is None and "application_id" in self.model_fields_set:
            _dict['application_id'] = None

        return _dict

    @classmethod
    def from_dict(cls, obj: Optional[Dict[str, Any]]) -> Optional[Self]:
        """Create an instance of DaemonEnvironmentCreate from a dict"""
        if obj is None:
            return None

        if not isinstance(obj, dict):
            return cls.model_validate(obj)

        _obj = cls.model_validate({
            "linked_resources": [ResourceToBeLinked.from_dict(_item) for _item in obj["linked_resources"]] if obj.get("linked_resources") is not None else None,
            "command": obj.get("command"),
            "process_count": obj.get("process_count"),
            "working_directory": obj.get("working_directory"),
            "run_as_user": obj.get("run_as_user"),
            "name": obj.get("name"),
            "application_id": obj.get("application_id")
        })
        return _obj


