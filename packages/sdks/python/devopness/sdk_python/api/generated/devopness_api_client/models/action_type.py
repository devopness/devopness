# coding: utf-8

"""
    devopness API

    Devopness API - Painless essential DevOps to everyone 

    The version of the OpenAPI document: latest
    Generated by OpenAPI Generator (https://openapi-generator.tech)

    Do not edit the class manually.
"""  # noqa: E501


from __future__ import annotations
import json
from enum import Enum
from typing_extensions import Self


class ActionType(str, Enum):
    """
    ActionType
    """

    """
    allowed enum values
    """
    CONFIGURE = 'configure'
    CHECK_PROVISIONED = 'check_provisioned'
    DELETE = 'delete'
    DEPLOY = 'deploy'
    GET_STATUS = 'get_status'
    PROVISION = 'provision'
    RELOAD = 'reload'
    RESTART = 'restart'
    START = 'start'
    STOP = 'stop'

    @classmethod
    def from_json(cls, json_str: str) -> Self:
        """Create an instance of ActionType from a JSON string"""
        return cls(json.loads(json_str))


