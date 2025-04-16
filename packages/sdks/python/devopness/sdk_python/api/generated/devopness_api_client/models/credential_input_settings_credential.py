# coding: utf-8

"""
    devopness API

    Devopness API - Painless essential DevOps to everyone 

    The version of the OpenAPI document: latest
    Generated by OpenAPI Generator (https://openapi-generator.tech)

    Do not edit the class manually.
"""  # noqa: E501


from __future__ import annotations
from inspect import getfullargspec
import json
import pprint
import re  # noqa: F401
from pydantic import BaseModel, ConfigDict, Field, StrictStr, ValidationError, field_validator
from typing import Optional
from devopness_api_client.models.credential_aws import CredentialAws
from devopness_api_client.models.credential_digital_ocean import CredentialDigitalOcean
from devopness_api_client.models.credential_google_cloud import CredentialGoogleCloud
from devopness_api_client.models.credential_source_provider import CredentialSourceProvider
from typing import Union, Any, List, Set, TYPE_CHECKING, Optional, Dict
from typing_extensions import Literal, Self
from pydantic import Field

CREDENTIALINPUTSETTINGSCREDENTIAL_ANY_OF_SCHEMAS = ["CredentialAws", "CredentialDigitalOcean", "CredentialGoogleCloud", "CredentialSourceProvider"]

class CredentialInputSettingsCredential(BaseModel):
    """
    Cloud provider credential
    """

    # data type: CredentialAws
    anyof_schema_1_validator: Optional[CredentialAws] = None
    # data type: CredentialDigitalOcean
    anyof_schema_2_validator: Optional[CredentialDigitalOcean] = None
    # data type: CredentialGoogleCloud
    anyof_schema_3_validator: Optional[CredentialGoogleCloud] = None
    # data type: CredentialSourceProvider
    anyof_schema_4_validator: Optional[CredentialSourceProvider] = None
    if TYPE_CHECKING:
        actual_instance: Optional[Union[CredentialAws, CredentialDigitalOcean, CredentialGoogleCloud, CredentialSourceProvider]] = None
    else:
        actual_instance: Any = None
    any_of_schemas: Set[str] = { "CredentialAws", "CredentialDigitalOcean", "CredentialGoogleCloud", "CredentialSourceProvider" }

    model_config = {
        "validate_assignment": True,
        "protected_namespaces": (),
    }

    def __init__(self, *args, **kwargs) -> None:
        if args:
            if len(args) > 1:
                raise ValueError("If a position argument is used, only 1 is allowed to set `actual_instance`")
            if kwargs:
                raise ValueError("If a position argument is used, keyword arguments cannot be used.")
            super().__init__(actual_instance=args[0])
        else:
            super().__init__(**kwargs)

    @field_validator('actual_instance')
    def actual_instance_must_validate_anyof(cls, v):
        instance = CredentialInputSettingsCredential.model_construct()
        error_messages = []
        # validate data type: CredentialAws
        if not isinstance(v, CredentialAws):
            error_messages.append(f"Error! Input type `{type(v)}` is not `CredentialAws`")
        else:
            return v

        # validate data type: CredentialDigitalOcean
        if not isinstance(v, CredentialDigitalOcean):
            error_messages.append(f"Error! Input type `{type(v)}` is not `CredentialDigitalOcean`")
        else:
            return v

        # validate data type: CredentialGoogleCloud
        if not isinstance(v, CredentialGoogleCloud):
            error_messages.append(f"Error! Input type `{type(v)}` is not `CredentialGoogleCloud`")
        else:
            return v

        # validate data type: CredentialSourceProvider
        if not isinstance(v, CredentialSourceProvider):
            error_messages.append(f"Error! Input type `{type(v)}` is not `CredentialSourceProvider`")
        else:
            return v

        if error_messages:
            # no match
            raise ValueError("No match found when setting the actual_instance in CredentialInputSettingsCredential with anyOf schemas: CredentialAws, CredentialDigitalOcean, CredentialGoogleCloud, CredentialSourceProvider. Details: " + ", ".join(error_messages))
        else:
            return v

    @classmethod
    def from_dict(cls, obj: Dict[str, Any]) -> Self:
        return cls.from_json(json.dumps(obj))

    @classmethod
    def from_json(cls, json_str: str) -> Self:
        """Returns the object represented by the json string"""
        instance = cls.model_construct()
        error_messages = []
        # anyof_schema_1_validator: Optional[CredentialAws] = None
        try:
            instance.actual_instance = CredentialAws.from_json(json_str)
            return instance
        except (ValidationError, ValueError) as e:
             error_messages.append(str(e))
        # anyof_schema_2_validator: Optional[CredentialDigitalOcean] = None
        try:
            instance.actual_instance = CredentialDigitalOcean.from_json(json_str)
            return instance
        except (ValidationError, ValueError) as e:
             error_messages.append(str(e))
        # anyof_schema_3_validator: Optional[CredentialGoogleCloud] = None
        try:
            instance.actual_instance = CredentialGoogleCloud.from_json(json_str)
            return instance
        except (ValidationError, ValueError) as e:
             error_messages.append(str(e))
        # anyof_schema_4_validator: Optional[CredentialSourceProvider] = None
        try:
            instance.actual_instance = CredentialSourceProvider.from_json(json_str)
            return instance
        except (ValidationError, ValueError) as e:
             error_messages.append(str(e))

        if error_messages:
            # no match
            raise ValueError("No match found when deserializing the JSON string into CredentialInputSettingsCredential with anyOf schemas: CredentialAws, CredentialDigitalOcean, CredentialGoogleCloud, CredentialSourceProvider. Details: " + ", ".join(error_messages))
        else:
            return instance

    def to_json(self) -> str:
        """Returns the JSON representation of the actual instance"""
        if self.actual_instance is None:
            return "null"

        if hasattr(self.actual_instance, "to_json") and callable(self.actual_instance.to_json):
            return self.actual_instance.to_json()
        else:
            return json.dumps(self.actual_instance)

    def to_dict(self) -> Optional[Union[Dict[str, Any], CredentialAws, CredentialDigitalOcean, CredentialGoogleCloud, CredentialSourceProvider]]:
        """Returns the dict representation of the actual instance"""
        if self.actual_instance is None:
            return None

        if hasattr(self.actual_instance, "to_dict") and callable(self.actual_instance.to_dict):
            return self.actual_instance.to_dict()
        else:
            return self.actual_instance

    def to_str(self) -> str:
        """Returns the string representation of the actual instance"""
        return pprint.pformat(self.model_dump())


