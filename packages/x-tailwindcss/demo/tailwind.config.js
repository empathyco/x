import { options } from './options';
import plugin from '../src/x-tailwind-plugin/plugin';

export default {
  content: ['./demo/index.html', './demo/*.ts'],
  prefix: 'x-',
  theme: {
    extend: {}
  },
  plugins: [plugin(options)]
};
