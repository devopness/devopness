"""
Devopness API Python SDK - Painless essential DevOps to everyone

Note:
    This is auto generated by OpenAPI Generator.
    https://openapi-generator.tech
"""

from typing import (
    List,
    Optional,
    Required,
    TypedDict,
    Union,
)

from pydantic import Field, StrictInt, StrictStr

from .. import DevopnessBaseModel
from .action_deployment_data import ActionDeploymentData, ActionDeploymentDataPlain
from .action_resource import ActionResource, ActionResourcePlain
from .action_status import ActionStatus, ActionStatusPlain
from .action_status_reason_code import (
    ActionStatusReasonCode,
    ActionStatusReasonCodePlain,
)
from .action_summary import ActionSummary, ActionSummaryPlain
from .action_target import ActionTarget, ActionTargetPlain
from .action_triggered_from import ActionTriggeredFrom, ActionTriggeredFromPlain
from .action_type import ActionType, ActionTypePlain


class ActionRelation(DevopnessBaseModel):
    """
    ActionRelation

    Attributes:
        id (int): The Id of the given action
        status (ActionStatus):
        status_human_readable (str): Human readable version of action status
        status_reason_code (ActionStatusReasonCode):
        status_reason_human_readable (str): Human readable version of the status reason code
        type (ActionType):
        type_human_readable (str): Human readable version of the action type
        url_web_permalink (str): The permalink URL to the action details on Devopness web app
        action_data (ActionDeploymentData, optional, nullable):
        triggered_from (ActionTriggeredFrom):
        resource (ActionResource):
        summary (ActionSummary, optional):
        targets (List[ActionTarget], optional): List of actions dispatched to cloud resource targets
        started_at (str, optional, nullable): The date and time when the action started execution (i.e., left the &#x60;pending/queued&#x60; status)
        completed_at (str, optional, nullable): The date and time when the action has finished execution
        created_at (str): The date and time when the record was created
        updated_at (str): The date and time when the record was last updated
    """

    id: StrictInt = Field(description="The Id of the given action")
    status: ActionStatus
    status_human_readable: StrictStr = Field(
        description="Human readable version of action status"
    )
    status_reason_code: ActionStatusReasonCode
    status_reason_human_readable: StrictStr = Field(
        description="Human readable version of the status reason code"
    )
    type: ActionType
    type_human_readable: StrictStr = Field(
        description="Human readable version of the action type"
    )
    url_web_permalink: StrictStr = Field(
        description="The permalink URL to the action details on Devopness web app"
    )
    action_data: Optional[ActionDeploymentData]
    triggered_from: ActionTriggeredFrom
    resource: ActionResource
    summary: Optional[ActionSummary] = None
    targets: Optional[List[ActionTarget]] = Field(
        default=None, description="List of actions dispatched to cloud resource targets"
    )
    started_at: Optional[StrictStr] = Field(
        description="The date and time when the action started execution (i.e., left the `pending/queued` status)"
    )
    completed_at: Optional[StrictStr] = Field(
        description="The date and time when the action has finished execution"
    )
    created_at: StrictStr = Field(
        description="The date and time when the record was created"
    )
    updated_at: StrictStr = Field(
        description="The date and time when the record was last updated"
    )


class ActionRelationPlain(TypedDict, total=False):
    """
    Plain version of ActionRelation.
    """

    id: Required[int]
    status: Required[
        Union[
            ActionStatus,
            ActionStatusPlain,
        ]
    ]
    status_human_readable: Required[str]
    status_reason_code: Required[
        Union[
            ActionStatusReasonCode,
            ActionStatusReasonCodePlain,
        ]
    ]
    status_reason_human_readable: Required[str]
    type: Required[
        Union[
            ActionType,
            ActionTypePlain,
        ]
    ]
    type_human_readable: Required[str]
    url_web_permalink: Required[str]
    action_data: Optional[
        Union[
            ActionDeploymentData,
            ActionDeploymentDataPlain,
        ]
    ]
    triggered_from: Required[
        Union[
            ActionTriggeredFrom,
            ActionTriggeredFromPlain,
        ]
    ]
    resource: Required[
        Union[
            ActionResource,
            ActionResourcePlain,
        ]
    ]
    summary: Optional[
        Union[
            ActionSummary,
            ActionSummaryPlain,
        ]
    ]
    targets: Optional[
        List[
            Union[
                ActionTarget,
                ActionTargetPlain,
            ]
        ]
    ]
    started_at: Optional[str]
    completed_at: Optional[str]
    created_at: Required[str]
    updated_at: Required[str]
