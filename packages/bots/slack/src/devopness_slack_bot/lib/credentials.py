"""
Service for managing user credentials securely with encryption.
"""

from base64 import b64encode
from typing import Literal

from cryptography.fernet import Fernet

from devopness_slack_bot.lib.devopness_api import DevopnessCredentials
from devopness_slack_bot.models import UserCredential

# Global cipher instances (cached by key)
_ciphers: dict[str, Fernet] = {}


def _get_cipher(encryption_key: str) -> Fernet:
    """
    Get or create the Fernet cipher instance for a given key.

    Args:
        encryption_key: Base64-encoded Fernet key (32 bytes)

    Returns:
        Fernet cipher instance
    """
    if encryption_key not in _ciphers:
        _ciphers[encryption_key] = Fernet(encryption_key.encode("utf-8"))

    return _ciphers[encryption_key]


async def save_user_token(
    slack_user_id: str,
    token: str,
    encryption_key: str,
    token_type: Literal["api_token", "oauth_token"] = "api_token",  # noqa: S107
) -> UserCredential:
    """
    Save or update a user's Devopness API token with encryption.

    Args:
        slack_user_id: The Slack user ID (e.g., "U06LBSCETQ9")
        token: The plain-text Devopness API token
        encryption_key: Fernet encryption key
        token_type: Type of token ("api_token" or "oauth_token")

    Returns:
        The created or updated UserCredential instance
    """
    cipher = _get_cipher(encryption_key)

    # First encode as base64 (as expected by ensure_authenticated)
    encoded_token = b64encode(token.encode("utf-8")).decode("utf-8")

    # Then encrypt the base64-encoded token
    encrypted_bytes = cipher.encrypt(encoded_token.encode("utf-8"))
    encrypted_token = encrypted_bytes.decode("utf-8")

    # Update or create the credential
    credential, _ = await UserCredential.update_or_create(
        slack_user_id=slack_user_id,
        defaults={
            "encrypted_token": encrypted_token,
            "token_type": token_type,
        },
    )

    return credential


async def get_user_credentials(
    slack_user_id: str,
    encryption_key: str,
) -> DevopnessCredentials | None:
    """
    Retrieve a user's Devopness credentials and decrypt.

    Args:
        slack_user_id: The Slack user ID
        encryption_key: Fernet encryption key

    Returns:
        DevopnessCredentials if found, None otherwise
    """
    credential = await UserCredential.filter(slack_user_id=slack_user_id).first()

    if not credential:
        return None

    cipher = _get_cipher(encryption_key)

    # Decrypt the token
    try:
        decrypted_bytes = cipher.decrypt(credential.encrypted_token.encode("utf-8"))
        decrypted_token = decrypted_bytes.decode("utf-8")
    except Exception:
        # Token was encrypted with a different key or corrupted
        return None

    return DevopnessCredentials(
        type=credential.token_type,  # type: ignore[arg-type]
        data=decrypted_token,  # Return the base64-encoded token
    )


async def delete_user_credentials(slack_user_id: str) -> bool:
    """
    Delete a user's stored credentials.

    Args:
        slack_user_id: The Slack user ID

    Returns:
        True if credentials were deleted, False if not found
    """
    deleted_count = await UserCredential.filter(slack_user_id=slack_user_id).delete()
    return deleted_count > 0
