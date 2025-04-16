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


class CronJobPattern(str, Enum):
    """
    A translation of the cron expression to a readable string indicating its execution frequency.
    """

    """
    allowed enum values
    """
    EVERY_MINUTE = 'Every minute'
    HOURLY = 'Hourly'
    DAILY = 'Daily'
    TWICE_A_DAY = 'Twice a day'
    WEEKLY = 'Weekly'
    MONTHLY = 'Monthly'
    YEARLY = 'Yearly'

    @classmethod
    def from_json(cls, json_str: str) -> Self:
        """Create an instance of CronJobPattern from a JSON string"""
        return cls(json.loads(json_str))


