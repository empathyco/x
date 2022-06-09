import { options } from './options';
import plugin from '../src/plugin';

export default {
  content: ['./demo/index.html', './demo/*.ts'],
  prefix: 'x-',
  theme: {
    extend: {}
  },
  plugins: [plugin(options)]
};
