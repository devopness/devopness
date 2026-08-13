/**
 * Devopness API TypeScript SDK - Painless essential DevOps to everyone
 */

type QueryStringParam = unknown;

/**
 * Returns the query string from the given query parameters.
 *
 * @param inParams The query parameters.
 * @returns The query string.
 */
export function parseQueryString(inParams: Record<string, QueryStringParam> = {}): string {
  const outParams: Record<string, QueryStringParam> = {};

  for (const key of Object.keys(inParams)) {
    const value = inParams[key];

    if (isEmpty(value)) {
      continue;
    }

    if (key === "filter") {
      Object.assign(outParams, parseFilterQueryString(value));
      continue;
    }

    outParams[key] = value;
  }

  const searchParams = new URLSearchParams();

  for (const key of Object.keys(outParams)) {
    searchParams.append(key, String(outParams[key]));
  }

  return searchParams.toString();
}

/**
 * Returns the query string from the given filter parameters.
 *
 * @param filterParam The filter parameters.
 * @returns The filter query string parameters.
 */
function parseFilterQueryString(filterParam: QueryStringParam): Record<string, QueryStringParam> {
  const outParams: Record<string, QueryStringParam> = {};

  if (typeof filterParam !== "object" || filterParam === null || Array.isArray(filterParam)) {
    return outParams;
  }

  const params = filterParam as Record<string, QueryStringParam>;

  for (const key of Object.keys(params)) {
    const value = params[key];

    if (isEmpty(value)) {
      continue;
    }

    const filterKey = `filter[${key}]`;
    const filterValue = String(value);

    outParams[filterKey] = filterValue;
  }

  return outParams;
}

/**
 * Return whether a query parameter value should be omitted.
 *
 * @param value The query parameter value.
 * @returns Whether the query parameter value should be omitted.
 */
function isEmpty(value: QueryStringParam): boolean {
  return (
    value === undefined ||
    value === null ||
    value === false ||
    value === "" ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0)
  );
}
