/* eslint-disable @typescript-eslint/explicit-function-return-type */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { cleanMarkdown } = require('../utils');

/**
 * Function to overwrite slots template on vue-docgen.
 *
 * @remarks
 * The default docgen is generating `<br>` tags which makes Docusaurus build to break.
 * This template replaces the tag for `<br />`
 *
 * @param slots - Array with slots data.
 * @returns String with slots doc formatted.
 *
 * @internal
 */
function createDocsSlotsSection(slots) {
  return `
## Slots

| Name          | Description  | Bindings |
| ------------- | ------------ | -------- |
${slots.map(toSlotsMarkdownTable).join('\n')}
`;
}

/**
 * Function to format the bindings section.
 *
 * @remarks
 * This function creates a new line for every binding with this format:
 * **bindingName** `bindingType` - binding description
 *
 * @param bindings - The bindings to format.
 * @returns String with each binding in a newline.
 *
 */
const formatBindings = bindings => {
  return bindings
    .map(binding => {
      const { name, description, type } = binding;
      if (!type) {
        return '';
      }
      return `**${name}** <code>${
        type.name === 'union' && type.elements
          ? type.elements.map(({ name: insideName }) => insideName).join(' &#124; ')
          : type.name
      }</code> - ${description}`;
    })
    .join('\n');
};

/**
 * Transforms the slots array into a markdown table.
 *
 * @param slot - Each of the slots of the template.
 * @returns String with markdown table row.
 *
 * @internal
 */
function toSlotsMarkdownTable({ description = '', bindings = {}, name }) {
  const readableBindings = Object.keys(bindings).length ? `${formatBindings(bindings)}` : '';
  return `| ${cleanMarkdown(name)} | ${cleanMarkdown(description)} | ${cleanMarkdown(
    readableBindings
  )} |`;
}

module.exports = createDocsSlotsSection;
