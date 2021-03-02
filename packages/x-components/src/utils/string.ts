/**
 * Util used to return true if the string is empty, undefined or null.
 *
 * @param str - String value.
 * @returns Returns true if str is an empty string, undefined or null.
 * @public
 */
export function isStringEmpty(str?: string | null): boolean {
  return !str || str.length === 0;
}

/**
 * Util to transform string a into kebab case.
 *
 * @example
 * Transforms `camelCase` into `camel-case`
 * Transforms `PascalCase` into `pascal-case`
 * Transforms `snake_case` into `snake-case`
 * Transforms `space space  multispaces` into `space-space-multiplespaces`
 * Transforms `kebab-case` into `kebab-case`
 *
 * @param str - String value.
 * @returns Returns the string in kebab case.
 * @public
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+|_/g, '-')
    .toLowerCase();
}
