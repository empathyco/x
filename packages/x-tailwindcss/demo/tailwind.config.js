import { options } from './options';
import plugin from '../src/x-tailwind-plugin/plugin';

export default {
  content: ['./demo/index.html', './demo/*.ts'],
  prefix: 'x-',
  important: true,
  theme: {
    extend: {}
  },
  plugins: [plugin(options)]
};
