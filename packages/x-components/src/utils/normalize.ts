/**
 * If the `String.normalize` function is available in the environment, it removes the
 * {@link https://en.wikipedia.org/wiki/Combining_Diacritical_Marks | combining diacritical marks}
 * characters from it.
 * Otherwise, it just returns the same string.
 *
 * @param string - The string to remove its combining diacritical mark characters.
 * @returns If the environment supports string normalization, the string without the combining
 * diacritical marks. Else the same string.
 */
const removeCombiningDiacriticalMarks = String.prototype.normalize
  ? (string: string) => string.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  : (string: string) => string;

/**
 * Trims the string, transforms it to lower case, and removes
 * {@link https://en.wikipedia.org/wiki/Combining_Diacritical_Marks | combining diacritical marks}
 * from it.
 *
 * @param string - The string to normalize.
 * @returns The normalized version of the string.
 * @public
 */
export function normalizeString(string: string | undefined): string {
  string = string?.trim().toLowerCase() ?? '';
  return removeCombiningDiacriticalMarks(string);
}
