import unittest

from devopness.generated.utils import parse_query_string


class TestParseQueryString(unittest.TestCase):
    def test_parse_query_string_keeps_scalar_values_and_omits_empty_ones(self) -> None:
        params = {
            "string": "hello",
            "integer": 123,
            "float": 123.456,
            "boolean": True,
            "false_value": False,
            "null_value": None,
            "empty_string": "",
            "empty_list": [],
            "empty_dict": {},
        }

        query_string = parse_query_string(params)

        expected_query_string = "string=hello"
        expected_query_string += "&integer=123"
        expected_query_string += "&float=123.456"
        expected_query_string += "&boolean=True"

        self.assertEqual(query_string, expected_query_string)

    def test_parse_query_string_preserves_zero_values(self) -> None:
        params = {
            "page": 0,
            "limit": 0,
        }

        query_string = parse_query_string(params)

        expected_query_string = "page=0"
        expected_query_string += "&limit=0"

        self.assertEqual(query_string, expected_query_string)

    def test_parse_query_string_expands_filter_parameters(self) -> None:
        params = {
            "page": 1,
            "filter": {
                "organization_id": 123,
                "project_id": 0,
                "status": "queued",
                "empty_value": "",
                "empty_list": [],
                "empty_dict": {},
            },
        }

        query_string = parse_query_string(params)

        expected_query_string = "page=1"
        expected_query_string += "&filter%5Borganization_id%5D=123"
        expected_query_string += "&filter%5Bproject_id%5D=0"
        expected_query_string += "&filter%5Bstatus%5D=queued"

        self.assertEqual(query_string, expected_query_string)

    def test_parse_query_string_ignores_invalid_filter_values(self) -> None:
        params = {
            "filter": None,
            "other": "value",
        }

        query_string = parse_query_string(params)

        expected_query_string = "other=value"

        self.assertEqual(query_string, expected_query_string)
