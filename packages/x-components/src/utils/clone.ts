/**
 * Deeply clones an object or an array.
 *
 * @param something - The object to clone.
 * @returns A deep clone of the provided value.
 *
 * @public
 */
export function clone<Something>(something: Something): Something {
  // eslint-disable-next-line ts/no-unsafe-return
  return JSON.parse(JSON.stringify(something))
}
