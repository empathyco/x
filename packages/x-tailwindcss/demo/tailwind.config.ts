import xTailwindCss from '../src/x-tailwind-plugin/plugin';

export default {
  content: ['./index.html', './**/*.vue'],
  prefix: 'x-',
  important: true,
  theme: {
    extend: {}
  },
  plugins: [
    xTailwindCss({
      components() {
        return {};
      },
      utilities() {
        return {};
      },
      dynamicUtilities() {
        return {};
      },
      dynamicComponents() {
        return {};
      },
      theme: {}
    })
  ]
};
