const { cleanMarkdown, removeLinks } = require('../utils')

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
`
}

/**
 * Transforms each prop into a markdown table row.
 *
 * @param prop - Each of the prop of the template.
 * @param prop.name - Template name.
 * @param prop.type - Template type.
 * @param prop.defaultValue - Template defaultValue.
 * @param prop.description - Template description.
 * @returns String with markdown table row.
 *
 * @internal
 */
function toPropsMarkdownTable({ name = '', type = {}, defaultValue = {}, description = '' }) {
  const typeName = type.name ? type.name : ''
  const value = defaultValue.value ? defaultValue.value : ''

  return `| <code>${cleanMarkdown(name)}</code> | ${cleanMarkdown(
    removeLinks(description),
  )} | <code>${cleanMarkdown(typeName)}</code> | <code>${cleanMarkdown(value)}</code> |`
}

module.exports = createDocsPropsSection
