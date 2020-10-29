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
 * TODO Use this template to make this formatting prettier in task: EX-1688.
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
 * Transforms the slots array into a markdown table.
 *
 * @param slot - Each of the slots of the template.
 * @returns String with markdown table row.
 *
 * @internal
 */
function toSlotsMarkdownTable({ description = '', bindings = {}, name }) {
  const readableBindings = Object.keys(bindings).length ? JSON.stringify(bindings, null, 2) : '';
  return `| ${cleanMarkdown(name)} | ${cleanMarkdown(description)} | ${cleanMarkdown(
    readableBindings
  )} |`;
}

module.exports = createDocsSlotsSection;
