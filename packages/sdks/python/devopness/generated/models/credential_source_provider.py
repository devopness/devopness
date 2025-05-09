"""
Devopness API Python SDK - Painless essential DevOps to everyone

Note:
    This is auto generated by OpenAPI Generator.
    https://openapi-generator.tech
"""

from typing import (
    Required,
    TypedDict,
)

from pydantic import Field, StrictStr

from .. import DevopnessBaseModel


class CredentialSourceProvider(DevopnessBaseModel):
    """
    CredentialSourceProvider

    Attributes:
        callback_code (str): The temporary code forwarded by the OAuth provider as a parameter to our callback URL
    """

    callback_code: StrictStr = Field(
        description="The temporary code forwarded by the OAuth provider as a parameter to our callback URL"
    )


class CredentialSourceProviderPlain(TypedDict, total=False):
    """
    Plain version of CredentialSourceProvider.
    """

    callback_code: Required[str]
