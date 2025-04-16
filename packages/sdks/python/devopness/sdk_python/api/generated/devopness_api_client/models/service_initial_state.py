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


class ServiceInitialState(str, Enum):
    """
    The expected initial state of the service after installed
    """

    """
    allowed enum values
    """
    STARTED = 'started'
    STOPPED = 'stopped'

    @classmethod
    def from_json(cls, json_str: str) -> Self:
        """Create an instance of ServiceInitialState from a JSON string"""
        return cls(json.loads(json_str))


