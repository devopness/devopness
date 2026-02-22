import unittest

from devopness.generated.utils import parse_query_string


class TestParseQueryString(unittest.TestCase):
    def test_parse_query_string(self) -> None:
        params = {
            "string": "hello",
            "integer": 123,
            "float": 123.456,
            "boolean": True,
            "list": ["a", "b", "c"],
            "dict": {"a": 1, "b": 2},
            "null": None,
            "empty_string": "",
            "empty_list": [],
            "empty_dict": {},
        }

        query_string = parse_query_string(params)
        expected_query_string = "string=hello"
        expected_query_string += "&integer=123"
        expected_query_string += "&float=123.456"
        expected_query_string += "&boolean=True"
        expected_query_string += "&list=%5B%27a%27%2C+%27b%27%2C+%27c%27%5D"
        expected_query_string += "&dict=%7B%27a%27%3A+1%2C+%27b%27%3A+2%7D"

        self.assertEqual(query_string, expected_query_string)
