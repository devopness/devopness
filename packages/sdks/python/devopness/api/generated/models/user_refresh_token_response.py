"""
Devopness API Python SDK - Painless essential DevOps to everyone

Note:
    This is auto generated by OpenAPI Generator.
    https://openapi-generator.tech
"""

from __future__ import annotations
import pprint
import re  # noqa: F401
import json

from pydantic import BaseModel, ConfigDict, Field, StrictInt, StrictStr
from typing import Any, ClassVar, Dict, List
from typing import Optional, Set
from typing_extensions import Self

class UserRefreshTokenResponse(BaseModel):
    """
    UserRefreshTokenResponse

    Attributes:
        token_type (str): The type of the authorization token being issued
        expires_in (int): The number of seconds remaining to the token expiration time, to be counted since the token issue date and time
        access_token (str): The issued JWT access token
        refresh_token (str): A token to be used after the original access token has expired, to issue a new token without requiring a new request to the /users/login endpoint
    """

    token_type: StrictStr = Field(description="The type of the authorization token being issued")
    expires_in: StrictInt = Field(description="The number of seconds remaining to the token expiration time, to be counted since the token issue date and time")
    access_token: StrictStr = Field(description="The issued JWT access token")
    refresh_token: StrictStr = Field(description="A token to be used after the original access token has expired, to issue a new token without requiring a new request to the /users/login endpoint")
    __properties: ClassVar[List[str]] = ["token_type", "expires_in", "access_token", "refresh_token"]

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
        """Create an instance of UserRefreshTokenResponse from a JSON string"""
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
        """Create an instance of UserRefreshTokenResponse from a dict"""
        if obj is None:
            return None

        if not isinstance(obj, dict):
            return cls.model_validate(obj)

        _obj = cls.model_validate({
            "token_type": obj.get("token_type"),
            "expires_in": obj.get("expires_in"),
            "access_token": obj.get("access_token"),
            "refresh_token": obj.get("refresh_token")
        })
        return _obj


