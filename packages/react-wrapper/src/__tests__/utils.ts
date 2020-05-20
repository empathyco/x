/**
 * Transforms the string parameter into a single line.
 *
 * @param text - Multiline string to transform into a single one.
 */
export function transformStringIntoASingleLine(text: string): string {
  return text.replace(/[\n\r\t]|\s{2,}/g, '');
}
