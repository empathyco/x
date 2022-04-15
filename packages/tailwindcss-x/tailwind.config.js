import { options } from './src/options';
import plugin from './src/plugin';

export default {
  content: ['./index.html', './src/**/*.ts'],
  prefix: 'x-',
  theme: {
    extend: {}
  },
  plugins: [plugin(options)]
};
