/* eslint-disable @typescript-eslint/explicit-function-return-type */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { cleanMarkdown } = require('../utils');

/**
 * Function to overwrite props template on vue-docgen.
 *
 * @param props - Array with props data.
 * @returns String with props doc formatted.
 *
 * @internal
 */
function createDocsPropsSection(props) {
  return `
## Props
| Name          | Description | Type      | Default     |
| ------------- |-------------| --------- | ----------- |
${props.map(toPropsMarkdownTable).join('\n')}
`;
}

/**
 * Transforms each prop into a markdown table row.
 *
 * @param prop - Each of the prop of the template.
 * @returns String with markdown table row.
 *
 * @internal
 */
function toPropsMarkdownTable({ name = '', type = {}, defaultValue = {}, description = '' }) {
  const typeName = type.name ? type.name : '';
  const value = defaultValue.value ? defaultValue.value : '';

  return `| <code>${cleanMarkdown(name)}</code> | ${cleanMarkdown(
    description
  )} | <code>${cleanMarkdown(typeName)}</code> | <code>${cleanMarkdown(value)}</code> |`;
}

module.exports = createDocsPropsSection;
