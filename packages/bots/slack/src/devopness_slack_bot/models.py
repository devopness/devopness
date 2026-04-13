"""
Database models for storing user credentials and bot data.
"""

from tortoise import fields
from tortoise.models import Model


class UserCredential(Model):
    """
    Stores encrypted Devopness API tokens for Slack users.
    """

    id = fields.IntField(pk=True)

    # Slack user ID (e.g., "U06LBSCETQ9")
    slack_user_id = fields.CharField(max_length=50, unique=True, index=True)

    # Base64-encoded token (as expected by ensure_authenticated)
    encrypted_token = fields.TextField()

    # Token type: "api_token" or "oauth_token"
    token_type = fields.CharField(max_length=20, default="api_token")

    # Metadata
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "user_credentials"

    def __str__(self) -> str:
        return f"UserCredential(slack_user_id={self.slack_user_id})"
