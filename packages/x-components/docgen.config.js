const { getDocumentFileDestination } = require('./build/docgen/utils.js');

module.exports = {
  componentsRoot: 'src',
  components: '**/*.vue',
  outDir: 'docs',
  getDestFile: getDocumentFileDestination,
  templates: {
    slots: require('./build/docgen/templates/docgen-slots.template'),
    props: require('./build/docgen/templates/docgen-props.template'),
    methods: require('./build/docgen/templates/docgen-methods.template'),
  }
};
