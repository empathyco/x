import { options } from './src/options';
import tailwindXPlugin from './src/tailwind-x.plugin';

export default {
  content: ['./index.html', './src/**/*.ts'],
  prefix: 'x-',
  theme: {
    extend: {}
  },
  plugins: [tailwindXPlugin(options)]
};
