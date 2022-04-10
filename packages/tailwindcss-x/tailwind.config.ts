import { TailwindConfig } from 'tailwindcss/tailwind-config';
import tailwindXPlugin from './src/tailwind-x.plugin';
import { ComponentsDefinition, PluginOptions } from './src/types';

const options: PluginOptions = {
  components({ theme }): ComponentsDefinition {
    return {
      '.btn': {
        backgroundColor: 'green',
        height: theme('height.8')
      }
    };
  },
  dynamicComponents({ theme }) {
    return [
      {
        btn: (value: any) => ({
          backgroundColor: value['50']
        }),
        patata: (value: any) => ({
          backgroundColor: value['100']
        })
      },
      {
        values: theme('colors')
      }
    ];
  },
  theme: {
    colors: {
      neutral: { 500: 'red', 100: 'orange' }
    },
    height: {
      1: '1px',
      2: '2px',
      4: '4px',
      8: '8px'
    }
  }
};

export default {
  content: ['./index.html', './src/**/*.ts'],
  prefix: 'x-',
  theme: {
    extend: {}
  },
  plugins: [tailwindXPlugin(options)]
} as TailwindConfig;
