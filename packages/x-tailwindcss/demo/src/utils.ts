/**
 * Adds a list of parent CSS classes to another CSS class.
 *
 * @param parentClasses - The list of parent classes.
 * @returns A string with the new list of classes.
 */
export function addParentClasses(...parentClasses: string[]): (value: string) => string {
  return cssClass => `${parentClasses.join(' ')} ${cssClass}`;
}
