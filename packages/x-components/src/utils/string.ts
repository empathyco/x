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
