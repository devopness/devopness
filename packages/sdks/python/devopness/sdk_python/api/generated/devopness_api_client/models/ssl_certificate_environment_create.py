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
from devopness_api_client.models.ssl_certificate_issuer import SslCertificateIssuer
from devopness_api_client.models.ssl_certificate_type import SslCertificateType
from devopness_api_client.models.ssl_certificate_validation_level import SslCertificateValidationLevel
from typing import Optional, Set
from typing_extensions import Self

class SslCertificateEnvironmentCreate(BaseModel):
    """
    SslCertificateEnvironmentCreate
    """ # noqa: E501
    virtual_host_id: StrictInt = Field(description="The ID of the virtual host to which this SSL certificate will be issued.")
    issuer: SslCertificateIssuer
    type: Optional[SslCertificateType] = None
    validation_level: Optional[SslCertificateValidationLevel] = None
    custom_private_key: Optional[StrictStr] = Field(default=None, description="The private key provided by the Certification Authority, when the certificate has not been automatically issued through `devopness`. This field is required when <code>issuer</code> is <code>custom</code>. Must be at least 100 characters. Must not be greater than 4096 characters.")
    custom_certificate: Optional[StrictStr] = Field(default=None, description="The contents of the certificate provided by the Certification Authority, when the certificate has not been automatically issued through `devopness`. This field is required when <code>issuer</code> is <code>custom</code>. Must be at least 100 characters. Must not be greater than 4096 characters.")
    __properties: ClassVar[List[str]] = ["virtual_host_id", "issuer", "type", "validation_level", "custom_private_key", "custom_certificate"]

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
        """Create an instance of SslCertificateEnvironmentCreate from a JSON string"""
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
        """Create an instance of SslCertificateEnvironmentCreate from a dict"""
        if obj is None:
            return None

        if not isinstance(obj, dict):
            return cls.model_validate(obj)

        _obj = cls.model_validate({
            "virtual_host_id": obj.get("virtual_host_id"),
            "issuer": obj.get("issuer"),
            "type": obj.get("type"),
            "validation_level": obj.get("validation_level"),
            "custom_private_key": obj.get("custom_private_key"),
            "custom_certificate": obj.get("custom_certificate")
        })
        return _obj


