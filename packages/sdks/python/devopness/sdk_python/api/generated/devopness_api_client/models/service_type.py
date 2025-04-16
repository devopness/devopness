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


class ServiceType(str, Enum):
    """
    Types of OS Services supported by Devopness
    """

    """
    allowed enum values
    """
    DOCKER = 'docker'
    MYSQL = 'mysql'
    NEWRELIC_MINUS_INFRA = 'newrelic-infra'
    NGINX = 'nginx'
    PHP = 'php'
    POSTGRESQL = 'postgresql'
    REDIS = 'redis'
    SUPERVISOR = 'supervisor'
    UFW = 'ufw'

    @classmethod
    def from_json(cls, json_str: str) -> Self:
        """Create an instance of ServiceType from a JSON string"""
        return cls(json.loads(json_str))


