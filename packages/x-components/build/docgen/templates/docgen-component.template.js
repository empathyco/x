function createComponentTemplate(renderedUsage, doc) {
  const { displayName, description, docsBlocks } = doc;
  const title = kebabToPascalCase(displayName);
  return `
  ---
  title: ${title}
  ---
  # ${title}

  ${description || ''}

  ${renderedUsage.props}
  ${renderedUsage.methods}
  ${renderedUsage.events}
  ${renderedUsage.slots}
  ${docsBlocks ? docsBlocks.join('\n') : ''}
  `;
}
function kebabToPascalCase(string) {
  const camelCaseString = string.replace(/-([a-z])/g, match => match[1].toUpperCase());
  return camelCaseString[0].toUpperCase() + camelCaseString.substring(1);
}

module.exports = createComponentTemplate;
