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
| Prop name     | Description | Type      | Values      | Default     |
| ------------- |-------------| --------- | ----------- | ----------- |
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
function toPropsMarkdownTable({
  name = '',
  type = {},
  defaultValue = {},
  values = [],
  description = ''
}) {
  const typeName = type.name ? type.name : '';
  const value = defaultValue.value ? defaultValue.value : '';
  const valuesString =
    values.length > 0 ? values.map(valueItem => `\`${valueItem}\``).join(', ') : '-';

  return `| ${cleanMarkdown(name)} | ${cleanMarkdown(description)} | ${cleanMarkdown(
    typeName
  )} | ${cleanMarkdown(value)} | ${cleanMarkdown(valuesString)} |`;
}

module.exports = createDocsPropsSection;
