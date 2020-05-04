const REPLACE_REGEX = /[<>&]/g;
/**
 * Sanitize characters from a given string.
 *
 * @param str - The string to remove unwanted characters.
 * @returns The string without the unwanted characters.
 * @public
 */
export const sanitize = (str: string): string => {
  return str.replace(REPLACE_REGEX, key => `&#${key.charCodeAt(0)};`);
};
