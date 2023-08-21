const { join } = require('path');

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

/**
 * Replaces all the `{@link Component}` appearances to not be shown on generated docs.
 *
 * @param input - Input to be cleaned.
 * @returns String cleaned markdown compatible string.
 *
 * @internal
 */
function removeLinks(input) {
  return input.replace(/ {@link/g, '').replace(/}/g, '');
}

const COMPONENTS_DOC_FOLDER = 'API-reference/components';

/**
 * This function is used in the config of `docgen.config.js` to generate the destination of each
 * documentation file generated by docgen.
 *
 * @param {string} file - The file to process and return its destination.
 * @param {object} config - The docgen config.
 * @returns {string} - The full path of the doc file. It is a relative to `docs` folder and
 * includes de file name and extension.
 */
function getDocumentFileDestination(file, config) {
  const commonComponentsRegex = /^components\/?(?<path>.*)\/(?<componentName>.+)\.vue$/;
  const xModulesRegex = /^x-modules\/(?<path>.+)\/components\/(?<componentName>.+)\.vue$/;

  const destinationFileName =
    generateDestination(join(COMPONENTS_DOC_FOLDER, 'common'), commonComponentsRegex, file) ||
    generateDestination(COMPONENTS_DOC_FOLDER, xModulesRegex, file);

  if (destinationFileName) {
    return join(config.outDir, destinationFileName);
  } else {
    return '';
  }
}

/**
 * Function to generate the documentation file path, using a regex to extract the path and file
 * name.
 * @param folder {string} - The base folder of the path.
 * @param regex {RegExp} - The the regex to extract the path and file name.
 * @param file {string} - The full path of documentation file to extract the path and file name
 * from.
 * @returns {string} - The full path of the doc file. It is a relative to `docs` folder and
 * includes de file name and extension. If it doesn't match the regex, an empty string is returned.
 */
function generateDestination(folder, regex, file) {
  const match = regex.exec(file);
  if (match) {
    const { path, componentName } = match.groups;
    return join(folder, path, `x-components.${componentName}.md`);
  } else {
    return '';
  }
}

module.exports = {
  cleanMarkdown,
  removeLinks,
  getDocumentFileDestination,
  COMPONENTS_DOC_FOLDER
};
