/**
 * Returns true if the two elements are the same, or if `b` is a child of `a`.
 *
 * @param a - The element to check if it is equal to `b` or if it contains `b`.
 * @param b - The element to check if it is equal to `a` or contained inside it.
 * @returns True if `a` is equal to `b` or if it contains `b`.
 */
export function isElementEqualOrContained(a: Element, b: Element): boolean {
  return a === b || a.contains(b);
}
