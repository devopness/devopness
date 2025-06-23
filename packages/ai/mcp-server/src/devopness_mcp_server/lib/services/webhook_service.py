from devopness.models import Hook, HookPipelineCreate, HookTypeParam

from ..devopness_api import devopness, ensure_authenticated


class WebHookService:
    @staticmethod
    async def tool_create_webhook(
        pipeline_id: int,
        hook_type: HookTypeParam,
        hook_settings: HookPipelineCreate,
    ) -> Hook:
        await ensure_authenticated()
        response = await devopness.hooks.add_pipeline_hook(
            hook_type,
            pipeline_id,
            hook_settings,
        )

        return response.data
