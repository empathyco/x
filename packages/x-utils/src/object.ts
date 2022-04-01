/**
 * Returns true if the retrieved parameter is an object.
 *
 * @param obj - The object to check.
 *
 * @returns A boolean indicating if the parameter is an object.
 */
export function isObject(obj: any): obj is Record<string, unknown> {
  return obj && typeof obj === 'object' && !Array.isArray(obj);
}
