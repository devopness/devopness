/**
 * Converts a stringInCamelCase to a string_separated_by_underscores.
 * @param camelCase camelCase string
 */
export function camelCaseToUnderscore(camelCase: string): string {
    const under = camelCase.replace(/([A-Z])/g, (g: string) => `_${g[0].toLowerCase()}`);
    return under[0] == '_' ? under.substring(1) : under;
}
