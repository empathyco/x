/**
 * Returns true if the number is greater than or equal than the min, and less than or equal than
 * the max.
 *
 * @param number - The number to check if it belongs to the range.
 * @param range - The range that the number should be in.
 * @returns True when the number is in the range. False otherwise.
 *
 * @public
 */
export function isInRange(number: number, [min, max]: [number, number]): boolean {
  return number >= min && number <= max;
}
