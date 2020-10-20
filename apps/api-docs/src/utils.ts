export function camelCaseToUnderscore(camelCase: string): string {
    const under = camelCase.replace(/([A-Z])/g, (g: string) => `_${g[0].toLowerCase()}`);
    return under[0] == '_' ? under.substr(1) : under;
}
