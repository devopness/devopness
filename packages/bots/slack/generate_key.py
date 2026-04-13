#!/usr/bin/env python3
"""
Generate a Fernet encryption key for the Slack bot.

Usage:
    python generate_key.py

This will output a key that you should add to your .env file as:
    DEVOPNESS_ENCRYPTION_KEY=<generated-key>
"""

from cryptography.fernet import Fernet


def main():
    """Generate and display a new Fernet encryption key."""
    key = Fernet.generate_key()
    key_str = key.decode("utf-8")

    print("=" * 60)
    print("🔐 Fernet Encryption Key Generated!")
    print("=" * 60)
    print()
    print("Add this to your .env file:")
    print()
    print(f"DEVOPNESS_ENCRYPTION_KEY={key_str}")
    print()
    print("⚠️  IMPORTANT:")
    print("  - Keep this key SECRET")
    print("  - Store it securely (e.g., 1Password, AWS Secrets Manager)")
    print("  - If you lose it, all encrypted tokens will be unrecoverable")
    print("  - Do NOT commit this key to git")
    print()
    print("=" * 60)


if __name__ == "__main__":
    main()
