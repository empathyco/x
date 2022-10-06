import { options } from './options';
import plugin from '../src/x-tailwind-plugin/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./demo/index.html', './demo/*.ts'],
  prefix: 'x-',
  important: true,
  theme: {
    extend: {}
  },
  plugins: [plugin(options)]
};
