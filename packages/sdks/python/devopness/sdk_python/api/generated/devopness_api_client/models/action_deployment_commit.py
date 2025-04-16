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
from pydantic import BaseModel, ConfigDict, Field, StrictStr
from typing import Any, ClassVar, Dict, List
from typing import Optional, Set
from typing_extensions import Self

class ActionDeploymentCommit(BaseModel):
    """
    Informations about the commit used on this deployment
    """ # noqa: E501
    repository: StrictStr = Field(description="The repository of the deployed application")
    author_name: StrictStr = Field(description="The author of the commit")
    author_email: StrictStr = Field(description="The commit author's email")
    committed_at: datetime = Field(description="The date and time when the commit was created")
    hash: StrictStr = Field(description="The commit hash used on deployment")
    message: StrictStr = Field(description="The commit message")
    url: StrictStr = Field(description="The commit URL on the source provider")
    clone_url: StrictStr = Field(description="The URL to clone the repository on the specific commit")
    download_url: StrictStr = Field(description="The URL to download the commit source code")
    __properties: ClassVar[List[str]] = ["repository", "author_name", "author_email", "committed_at", "hash", "message", "url", "clone_url", "download_url"]

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
        """Create an instance of ActionDeploymentCommit from a JSON string"""
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
        return _dict

    @classmethod
    def from_dict(cls, obj: Optional[Dict[str, Any]]) -> Optional[Self]:
        """Create an instance of ActionDeploymentCommit from a dict"""
        if obj is None:
            return None

        if not isinstance(obj, dict):
            return cls.model_validate(obj)

        _obj = cls.model_validate({
            "repository": obj.get("repository"),
            "author_name": obj.get("author_name"),
            "author_email": obj.get("author_email"),
            "committed_at": obj.get("committed_at"),
            "hash": obj.get("hash"),
            "message": obj.get("message"),
            "url": obj.get("url"),
            "clone_url": obj.get("clone_url"),
            "download_url": obj.get("download_url")
        })
        return _obj


