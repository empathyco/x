/**
 * Creates a selector for a dataTest property.
 *
 * @param dataTest - The value of the 'data-test' property.
 * @returns The selector for the given dataTest.
 */
export function getDataTestSelector(dataTest: string): string {
  return `[data-test=${dataTest}]`;
}
