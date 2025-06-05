import os

from devopness import DevopnessClientAsync
from devopness.models import UserLogin

from devopness.models import (
    ServerEnvironmentCreate,
    HookPipelineCreate,
    HookTypeParam,
)


devopness = DevopnessClientAsync()


async def ensure_authenticated():
    user_email = os.environ.get("DEVOPNESS_USER_EMAIL")
    user_pass = os.environ.get("DEVOPNESS_USER_PASSWORD")

    # TODO: only invoke login if not yet authenticated
    user_data = UserLogin(email=user_email, password=user_pass)
    await devopness.users.login_user(user_data)


async def get_user_profile():
    await ensure_authenticated()
    current_user = await devopness.users.get_user_me()

    return current_user.data


async def list_projects():
    await ensure_authenticated()
    response = await devopness.projects.list_projects()

    return response.data


async def list_environments(project_id: int):
    await ensure_authenticated()
    response = await devopness.environments.list_project_environments(project_id)

    return response.data


async def list_credentials(environment_id: int):
    await ensure_authenticated()
    response = await devopness.credentials.list_environment_credentials(environment_id)

    return response.data


async def list_servers(environment_id: int):
    await ensure_authenticated()
    response = await devopness.servers.list_environment_servers(environment_id)

    return response.data


async def list_applications(environment_id: int):
    await ensure_authenticated()
    response = await devopness.applications.list_environment_applications(
        environment_id
    )

    return response.data


async def list_application_pipelines(application_id: int):
    await ensure_authenticated()
    response = await devopness.pipelines.list_pipelines_by_resource_type(
        application_id, "application"
    )

    return response.data


async def create_server(
    environment_id: int, server_input_settings: ServerEnvironmentCreate
):
    await ensure_authenticated()
    response = await devopness.servers.add_environment_server(
        environment_id, server_input_settings
    )

    return response.data


async def create_webhook(
    pipeline_id: int, hook_type: HookTypeParam, hook_settings: HookPipelineCreate
):
    await ensure_authenticated()
    response = await devopness.hooks.add_pipeline_hook(
        hook_type, pipeline_id, hook_settings
    )

    return response.data
