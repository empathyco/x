/**
 * Deeply clones an object or an array.
 *
 * @param something - The object to clone.
 * @returns A deep clone of the provided value.
 */
export function clone<Something>(something: Something): Something {
  return JSON.parse(JSON.stringify(something));
}
