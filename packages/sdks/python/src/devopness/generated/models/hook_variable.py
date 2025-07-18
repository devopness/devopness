"""
Devopness API Python SDK - Painless essential DevOps to everyone

Note:
    This is auto generated by OpenAPI Generator.
    https://openapi-generator.tech
"""

from typing import (
    Optional,
    TypedDict,
    Union,
)

from pydantic import Field, StrictBool, StrictStr

from .. import DevopnessBaseModel
from .hook_variable_default_value import (
    HookVariableDefaultValue,
    HookVariableDefaultValuePlain,
)
from .hook_variable_type import HookVariableType, HookVariableTypePlain


class HookVariable(DevopnessBaseModel):
    """
    HookVariable

    Attributes:
        name (str, optional): The name of the variable
        path (str, optional): A dot-notation path of the variable to be used as the value to evaluate this condition. If not defined the &#x60;name&#x60; will be used instead.
        type (HookVariableType, optional):
        required (bool, optional): Defines if the variable is required
        default_value (HookVariableDefaultValue, optional, nullable):
    """

    name: Optional[StrictStr] = Field(
        default=None, description="The name of the variable"
    )
    path: Optional[StrictStr] = Field(
        default=None,
        description="A dot-notation path of the variable to be used as the value to evaluate this condition. If not defined the `name` will be used instead.",
    )
    type: Optional[HookVariableType] = None
    required: Optional[StrictBool] = Field(
        default=None, description="Defines if the variable is required"
    )
    default_value: Optional[HookVariableDefaultValue] = None


class HookVariablePlain(TypedDict, total=False):
    """
    Plain version of HookVariable.
    """

    name: Optional[str]
    path: Optional[str]
    type: Optional[
        Union[
            HookVariableType,
            HookVariableTypePlain,
        ]
    ]
    required: Optional[bool]
    default_value: Optional[
        Union[
            HookVariableDefaultValue,
            HookVariableDefaultValuePlain,
        ]
    ]
