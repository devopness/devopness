import { expect, test } from "vite-plus/test";

import { parseQueryString } from "../src/common/utils";

test("parseQueryString keeps scalar values and omits empty ones", () => {
  const queryString = parseQueryString({
    string: "hello",
    integer: 123,
    float: 123.456,
    boolean: true,
    falseValue: false,
    nullValue: null,
    undefinedValue: undefined,
    emptyString: "",
    emptyArray: [],
    emptyObject: {},
  });

  let expectedQueryString = "string=hello";
  expectedQueryString += "&integer=123";
  expectedQueryString += "&float=123.456";
  expectedQueryString += "&boolean=true";

  expect(queryString).toBe(expectedQueryString);
});

test("parseQueryString preserves zero values", () => {
  const queryString = parseQueryString({
    page: 0,
    limit: 0,
  });

  let expectedQueryString = "page=0";
  expectedQueryString += "&limit=0";

  expect(queryString).toBe(expectedQueryString);
});

test("parseQueryString expands filter parameters", () => {
  const queryString = parseQueryString({
    page: 1,
    filter: {
      organization_id: 123,
      project_id: 0,
      status: "queued",
      empty_value: "",
      empty_list: [],
      empty_object: {},
    },
  });

  let expectedQueryString = "page=1";
  expectedQueryString += "&filter%5Borganization_id%5D=123";
  expectedQueryString += "&filter%5Bproject_id%5D=0";
  expectedQueryString += "&filter%5Bstatus%5D=queued";

  expect(queryString).toBe(expectedQueryString);
});

test("parseQueryString ignores invalid filter values", () => {
  expect(
    parseQueryString({
      filter: null,
      other: "value",
    }),
  ).toBe("other=value");
});
