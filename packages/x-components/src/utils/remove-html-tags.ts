/**
 * Removes the `<` and `>` characters from a given string.
 *
 * @param str - The string to remove `<` and `>` characters.
 * @returns The string without the `<` and `>` characters.
 * @public
 */
export const removeHTMLTags = (str: string): string => str.replace(/<|>/g, '');
