"""
Tests for the DevopnessClientConfig class
"""

import unittest

from devopness import DevopnessClientConfig
from devopness.core.sdk_error import DevopnessSdkError


class TestDevopnessClientConfig(unittest.TestCase):
    def test_base_url_with_valid_values(self) -> None:
        config = DevopnessClientConfig(base_url="https://api.devopness.com")
        self.assertEqual(config.base_url, "https://api.devopness.com")

        config = DevopnessClientConfig.from_dict(
            {"base_url": "http://api.devopness.com"}
        )
        self.assertEqual(config.base_url, "http://api.devopness.com")

    def test_base_url_with_invalid_values(self) -> None:
        with self.assertRaises(DevopnessSdkError) as first_raises:
            DevopnessClientConfig.from_dict({"base_url": "invalid_url"})

        self.assertEqual(
            str(first_raises.exception),
            "\nDevopness SDK Error: Invalid 'base_url' in client configuration."
            "\nExpected a URL starting with 'http://' or 'https://', but received: 'invalid_url'."
            "\n"
            "\nHint: Make sure the 'base_url' includes the correct protocol, e.g., 'https://api.devopness.com'.",
        )

        with self.assertRaises(DevopnessSdkError) as second_raises:
            DevopnessClientConfig(base_url="api.devopness.com")

        self.assertEqual(
            str(second_raises.exception),
            "\nDevopness SDK Error: Invalid 'base_url' in client configuration."
            "\nExpected a URL starting with 'http://' or 'https://', but received: 'api.devopness.com'."
            "\n"
            "\nHint: Make sure the 'base_url' includes the correct protocol, e.g., 'https://api.devopness.com'.",
        )

        with self.assertRaises(DevopnessSdkError) as third_raises:
            DevopnessClientConfig(base_url="ftp://api.devopness.com/")

        self.assertEqual(
            str(third_raises.exception),
            "\nDevopness SDK Error: Invalid 'base_url' in client configuration."
            "\nExpected a URL starting with 'http://' or 'https://', but received: 'ftp://api.devopness.com/'."
            "\n"
            "\nHint: Make sure the 'base_url' includes the correct protocol, e.g., 'https://api.devopness.com'.",
        )

    def test_use_of_api_token_should_disable_auto_refresh_token(self) -> None:
        with self.assertWarns(UserWarning) as cm:
            config = DevopnessClientConfig(
                api_token="devopness_api_token",  # noqa: S106
                auto_refresh_token=True,
            )

        self.assertFalse(config.auto_refresh_token)
        self.assertIn(
            "Incompatible configuration detected: 'api_token' and 'auto_refresh_token' cannot be used together. "
            "The 'auto_refresh_token' option has been disabled automatically. "
            "To avoid this warning, explicitly set 'auto_refresh_token=False' in your configuration.",
            str(cm.warning),
        )
