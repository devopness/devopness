"""
Devopness API Python SDK - Painless essential DevOps to everyone

Note:
    This is auto generated by OpenAPI Generator.
    https://openapi-generator.tech
"""

from typing import (
    Optional,
    Required,
    TypedDict,
    Union,
)

from pydantic import Field, StrictBool, StrictInt, StrictStr

from .. import DevopnessBaseModel
from .action_relation_shallow import ActionRelationShallow, ActionRelationShallowPlain
from .ssl_certificate_issuer import SslCertificateIssuer, SslCertificateIssuerPlain
from .ssl_certificate_type import SslCertificateType, SslCertificateTypePlain
from .ssl_certificate_validation_level import (
    SslCertificateValidationLevel,
    SslCertificateValidationLevelPlain,
)


class SslCertificateRelation(DevopnessBaseModel):
    """
    SslCertificateRelation

    Attributes:
        id (int): The unique ID of the given SSL certificate
        name (str): The name given to SSL certificate
        type (SslCertificateType):
        issuer (SslCertificateIssuer):
        validation_level (SslCertificateValidationLevel):
        active (bool): Tells if the certificate is active for all linked servers and applications
        last_action (ActionRelationShallow, optional, nullable):
        expires_at (str, optional, nullable): The date and time when this certificate will no longer be valid, down to minute precision
        last_renewed_at (str, optional, nullable): The date and time when this certificate was renewed for the last time
        created_at (str, optional): The date and time when the record was created
        updated_at (str, optional): The date and time when the record was last updated
    """

    id: StrictInt = Field(description="The unique ID of the given SSL certificate")
    name: StrictStr = Field(description="The name given to SSL certificate")
    type: SslCertificateType
    issuer: SslCertificateIssuer
    validation_level: SslCertificateValidationLevel
    active: StrictBool = Field(
        description="Tells if the certificate is active for all linked servers and applications"
    )
    last_action: Optional[ActionRelationShallow] = None
    expires_at: Optional[StrictStr] = Field(
        description="The date and time when this certificate will no longer be valid, down to minute precision"
    )
    last_renewed_at: Optional[StrictStr] = Field(
        description="The date and time when this certificate was renewed for the last time"
    )
    created_at: Optional[StrictStr] = Field(
        default=None, description="The date and time when the record was created"
    )
    updated_at: Optional[StrictStr] = Field(
        default=None, description="The date and time when the record was last updated"
    )


class SslCertificateRelationPlain(TypedDict, total=False):
    """
    Plain version of SslCertificateRelation.
    """

    id: Required[int]
    name: Required[str]
    type: Required[
        Union[
            SslCertificateType,
            SslCertificateTypePlain,
        ]
    ]
    issuer: Required[
        Union[
            SslCertificateIssuer,
            SslCertificateIssuerPlain,
        ]
    ]
    validation_level: Required[
        Union[
            SslCertificateValidationLevel,
            SslCertificateValidationLevelPlain,
        ]
    ]
    active: Required[bool]
    last_action: Optional[
        Union[
            ActionRelationShallow,
            ActionRelationShallowPlain,
        ]
    ]
    expires_at: Optional[str]
    last_renewed_at: Optional[str]
    created_at: Optional[str]
    updated_at: Optional[str]
