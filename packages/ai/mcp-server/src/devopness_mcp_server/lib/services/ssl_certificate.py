from typing import Annotated, List, Literal, Optional

from pydantic import Field

from ..devopness_api import devopness, ensure_authenticated
from ..models import ActionSummary, SSLCertificateSummary
from ..response import MCPResponse
from ..types import MAX_RESOURCES_PER_PAGE, ExtraData, TypeListServerID
from ..utils import (
    get_instructions_choose_resource,
    get_instructions_format_list,
    get_instructions_format_resource,
    get_instructions_how_to_monitor_action,
    get_instructions_next_action_suggestion,
    get_web_link_to_environment_resource,
)


class SSLCertificateService:
    @staticmethod
    async def tool_list_ssl_certificates(
        project_id: int,
        environment_id: int,
        page: int = Field(
            default=1,
            gt=0,
        ),
    ) -> MCPResponse[List[SSLCertificateSummary]]:
        await ensure_authenticated()

        response = await devopness.ssl_certificates.list_environment_ssl_certificates(
            environment_id,
            page,
            per_page=MAX_RESOURCES_PER_PAGE,
        )

        ssl_certificates = [
            SSLCertificateSummary.from_sdk_model(
                ssl_certificate,
                ExtraData(
                    url_web_permalink=get_web_link_to_environment_resource(
                        project_id,
                        environment_id,
                        "ssl-certificate",
                        ssl_certificate.id,
                    ),
                ),
            )
            for ssl_certificate in response.data
        ]

        return MCPResponse(
            data=ssl_certificates,
            status="ok",
            instructions=[
                get_instructions_format_list(
                    "- [{ssl_certificate.name}]({ssl_certificate.url_web_permalink})"
                    " (ID: {ssl_certificate.id},"
                    " Active: IF {ssl_certificate.active}"
                    " THEN `🔒 Yes`"
                    " ELSE `🔓 False`)",
                ),
            ],
        )
