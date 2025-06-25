from typing import List

from pydantic import Field

from ..devopness_api import devopness, ensure_authenticated
from ..models import ActionSummary, SSLCertificateSummary
from ..response import MCPResponse
from ..types import MAX_RESOURCES_PER_PAGE, ExtraData, TypeListServerID
from ..utils import (
    get_instructions_choose_resource,
    get_instructions_format_resource_table,
    get_instructions_format_table,
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
                get_instructions_format_table(
                    [
                        (
                            "ID",
                            "{ssl_certificate.id}",
                        ),
                        (
                            "Name",
                            "[{ssl_certificate.name}]({ssl_certificate.url_web_permalink})",
                        ),
                        (
                            "Active",
                            "IF {ssl_certificate.active} THEN `🔒 Yes` ELSE `🔓 No`",
                        ),
                    ]
                ),
                get_instructions_choose_resource("ssl-certificate"),
                get_instructions_next_action_suggestion("deploy", "ssl-certificate"),
            ],
        )

    @staticmethod
    async def tool_create_ssl_certificate(
        project_id: int,
        environment_id: int,
        virtual_host_id: int,
    ) -> MCPResponse[SSLCertificateSummary]:
        await ensure_authenticated()

        response = await devopness.ssl_certificates.add_environment_ssl_certificate(
            environment_id,
            {
                "virtual_host_id": virtual_host_id,
                "issuer": "lets-encrypt",
            },
        )

        ssl_certificate = SSLCertificateSummary.from_sdk_model(
            response.data,
            ExtraData(
                url_web_permalink=get_web_link_to_environment_resource(
                    project_id,
                    environment_id,
                    "ssl-certificate",
                    response.data.id,
                ),
            ),
        )

        return MCPResponse.ok(
            ssl_certificate,
            [
                get_instructions_format_resource_table(
                    [
                        (
                            "ID",
                            "{ssl_certificate.id}",
                        ),
                        (
                            "Name",
                            "[{ssl_certificate.name}]({ssl_certificate.url_web_permalink})",
                        ),
                        (
                            "Active",
                            "IF {ssl_certificate.active} THEN `🔒 Yes` ELSE `🔓 No`",
                        ),
                    ]
                ),
                get_instructions_next_action_suggestion("deploy", "ssl-certificate"),
            ],
        )

    @staticmethod
    async def tool_deploy_ssl_certificate(
        pipeline_id: int,
        server_ids: TypeListServerID,
    ) -> MCPResponse[ActionSummary]:
        await ensure_authenticated()

        response = await devopness.actions.add_pipeline_action(
            pipeline_id,
            {
                "servers": server_ids,
            },
        )

        action = ActionSummary.from_sdk_model(response.data)

        return MCPResponse.ok(
            action,
            [
                get_instructions_how_to_monitor_action(action.url_web_permalink),
                "Show to the user how to access the domain using the URL 'https://{ssl_certificate.name}'",
            ],
        )
