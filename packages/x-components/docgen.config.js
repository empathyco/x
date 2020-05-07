// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  componentsRoot: 'src',
  components: '**/*.vue',
  outDir: 'docs',
  getDestFile(file, config) {
    const componentName = path
      .basename(file)
      .toLowerCase()
      .replace('-', '')
      .replace(/\.vue$/, '.md');
    const componentPath = config.outDir;
    return path.join(componentPath, `x-components.${componentName}`);
  },
  templates: {
    slots: require('./docgen-slots.template')
  }
};
