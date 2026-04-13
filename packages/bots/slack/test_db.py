#!/usr/bin/env python3
"""Quick test script to verify database setup and encryption works."""

import asyncio
import os

from cryptography.fernet import Fernet

from devopness_slack_bot.lib.credentials import (
    get_user_credentials,
    save_user_token,
)
from devopness_slack_bot.lib.database import close_database, init_database


async def main():
    # Generate a test encryption key (or use one from environment)
    encryption_key = os.environ.get("DEVOPNESS_ENCRYPTION_KEY")

    if not encryption_key:
        print("⚠️  No DEVOPNESS_ENCRYPTION_KEY found, generating a test key...")
        encryption_key = Fernet.generate_key().decode("utf-8")
        print(f"🔑 Using test key: {encryption_key[:20]}...")

    print("\nInitializing database...")
    await init_database()
    print("✅ Database initialized")

    print("\nSaving test token (encrypted)...")
    result = await save_user_token(
        slack_user_id="TEST_USER_123",
        token="test_token_12345",
        encryption_key=encryption_key,
        token_type="api_token",
    )
    print(f"✅ Token saved: {result}")
    print(f"   Encrypted value: {result.encrypted_token[:50]}...")

    print("\nRetrieving token (decrypting)...")
    credentials = await get_user_credentials(
        "TEST_USER_123",
        encryption_key=encryption_key,
    )
    if credentials:
        print(f"✅ Token retrieved and decrypted: type={credentials.type}")
        print(f"   Decrypted value starts with: {credentials.data[:20]}...")
    else:
        print("❌ Token not found")

    print("\nTesting with wrong key...")
    wrong_key = Fernet.generate_key().decode("utf-8")
    wrong_credentials = await get_user_credentials(
        "TEST_USER_123",
        encryption_key=wrong_key,
    )
    test_passed = True
    if wrong_credentials:
        print("❌ FAILED: Token decrypted with wrong key (should not happen)")
        test_passed = False
    else:
        print("✅ Correctly failed to decrypt with wrong key")

    print("\nCleaning up...")
    await close_database()
    print("✅ Database closed")

    if test_passed:
        print("\n✅ All tests passed! Encryption is working correctly.")
    else:
        print("\n❌ Some tests failed!")
        exit(1)


if __name__ == "__main__":
    asyncio.run(main())
