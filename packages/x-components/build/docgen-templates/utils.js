/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Replaces returns and tubes to make the input compatible with markdown.
 *
 * @param input - Input to be cleaned.
 * @returns String Cleaned markdown compatible string.
 *
 * @internal
 */
function cleanMarkdown(input) {
  return input.replace(/\r?\n/g, '<br />').replace(/\|/g, '\\|');
}

exports.cleanMarkdown = cleanMarkdown;
