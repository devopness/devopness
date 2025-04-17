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

from pydantic import BaseModel, ConfigDict, Field, StrictBool, StrictInt, StrictStr
from typing import Any, ClassVar, Dict, List, Optional
from .social_account_displayable_name import SocialAccountDisplayableName
from .social_account_provider import SocialAccountProvider
from typing import Optional, Set
from typing_extensions import Self


class SocialAccountRelation(BaseModel):
    """
    SocialAccountRelation

    Attributes:
        id (int): The ID of the given social account
        user_id (int): The current user&#39;s ID
        provider (SocialAccountProvider):
        provider_human_readable (SocialAccountDisplayableName):
        provider_user_nickname (str): The nickname of the user on the Source Authentication provider
        is_vcs (bool): Tells if the social account provider is a Source Code Provider/Version Control System. e.g. false for Facebook, true for Github
        token_expires_at (str): The date and time indicating when the authentication token will expire at
        created_at (str): The date and time when the record was created
        updated_at (str): The date and time when the record was last updated
    """

    id: StrictInt = Field(description="The ID of the given social account")
    user_id: StrictInt = Field(description="The current user's ID")
    provider: SocialAccountProvider
    provider_human_readable: SocialAccountDisplayableName
    provider_user_nickname: StrictStr = Field(
        description="The nickname of the user on the Source Authentication provider"
    )
    is_vcs: StrictBool = Field(
        description="Tells if the social account provider is a Source Code Provider/Version Control System. e.g. false for Facebook, true for Github"
    )
    token_expires_at: Optional[StrictStr] = Field(
        description="The date and time indicating when the authentication token will expire at"
    )
    created_at: StrictStr = Field(
        description="The date and time when the record was created"
    )
    updated_at: StrictStr = Field(
        description="The date and time when the record was last updated"
    )
    __properties: ClassVar[List[str]] = [
        "id",
        "user_id",
        "provider",
        "provider_human_readable",
        "provider_user_nickname",
        "is_vcs",
        "token_expires_at",
        "created_at",
        "updated_at",
    ]

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
        """Create an instance of SocialAccountRelation from a JSON string"""
        return cls.from_dict(json.loads(json_str))

    def to_dict(self) -> Dict[str, Any]:
        """Return the dictionary representation of the model using alias.

        This has the following differences from calling pydantic's
        `self.model_dump(by_alias=True)`:

        * `None` is only added to the output dict for nullable fields that
          were set at model initialization. Other fields with value `None`
          are ignored.
        """
        excluded_fields: Set[str] = set([])

        _dict = self.model_dump(
            by_alias=True,
            exclude=excluded_fields,
            exclude_none=True,
        )
        # set to None if token_expires_at (nullable) is None
        # and model_fields_set contains the field
        if (
            self.token_expires_at is None
            and "token_expires_at" in self.model_fields_set
        ):
            _dict["token_expires_at"] = None

        return _dict

    @classmethod
    def from_dict(cls, obj: Optional[Dict[str, Any]]) -> Optional[Self]:
        """Create an instance of SocialAccountRelation from a dict"""
        if obj is None:
            return None

        if not isinstance(obj, dict):
            return cls.model_validate(obj)

        _obj = cls.model_validate(
            {
                "id": obj.get("id"),
                "user_id": obj.get("user_id"),
                "provider": obj.get("provider"),
                "provider_human_readable": obj.get("provider_human_readable"),
                "provider_user_nickname": obj.get("provider_user_nickname"),
                "is_vcs": obj.get("is_vcs"),
                "token_expires_at": obj.get("token_expires_at"),
                "created_at": obj.get("created_at"),
                "updated_at": obj.get("updated_at"),
            }
        )
        return _obj
