import { Dictionary } from '@empathyco/x-utils';

/**
 * Replaces a key in compiledMessage for the provided key's value.
 *
 * @param compiledMessage - String containing the key to be replaced.
 * @param keyValueEntry - Key would be the string replaced in compiledMessage and value the
 * string that will get replaced with.
 * @returns Formatted string.
 * @internal
 */
const replaceParams = (compiledMessage: string, [key, value]: [string, string | number]): string =>
  compiledMessage.replace(new RegExp(`{${key}}`, 'g'), value.toString());

/**
 * Replaces each key in compiledMessage for the provided key's value.
 *
 * @param message - String containing the keys to be replaced.
 * @param params - Dictionary of key-values that will be used to format compiledMessage.
 * @returns Formatted string.
 * @public
 */
export function compileMessage(message: string, params: Dictionary<string | number>): string {
  return message && params
    ? Object.entries<string | number>(params).reduce(replaceParams, message)
    : message;
}
