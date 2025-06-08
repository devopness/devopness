import json
import unittest

from devopness.models import HookTypeParam


class TestHookTypeParamEnum(unittest.TestCase):
    def test_enum_values(self) -> None:
        self.assertEqual(HookTypeParam.INCOMING.value, "incoming")
        self.assertEqual(HookTypeParam.OUTGOING.value, "outgoing")

    def test_enum_str_cast(self) -> None:
        self.assertEqual(str(HookTypeParam.INCOMING), "incoming")
        self.assertEqual(str(HookTypeParam.OUTGOING), "outgoing")

    def test_enum_f_string(self) -> None:
        self.assertEqual(f"{HookTypeParam.INCOMING}", "incoming")
        self.assertEqual(f"{HookTypeParam.OUTGOING}", "outgoing")

    def test_enum_identity(self) -> None:
        self.assertIs(HookTypeParam("incoming"), HookTypeParam.INCOMING)
        self.assertIs(HookTypeParam("outgoing"), HookTypeParam.OUTGOING)

    def test_enum_from_json(self) -> None:
        self.assertEqual(
            HookTypeParam.from_json(json.dumps("incoming")),
            HookTypeParam.INCOMING,
        )

        self.assertEqual(
            HookTypeParam.from_json(json.dumps("outgoing")),
            HookTypeParam.OUTGOING,
        )

    def test_enum_invalid_value_raises(self) -> None:
        with self.assertRaises(ValueError):
            HookTypeParam("invalid")

        with self.assertRaises(ValueError):
            HookTypeParam.from_json(json.dumps("not-a-hook-type"))

    def test_enum_is_instance(self) -> None:
        self.assertIsInstance(HookTypeParam.INCOMING, HookTypeParam)
        self.assertIsInstance(HookTypeParam.OUTGOING, HookTypeParam)

    def test_enum_list_members(self) -> None:
        expected = ["incoming", "outgoing"]
        actual = [e.value for e in HookTypeParam]
        self.assertListEqual(actual, expected)
