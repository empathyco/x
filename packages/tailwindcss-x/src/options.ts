import { TailwindPluginFn } from 'tailwindcss/plugin';
import { Dictionary, DeepPartial } from '@empathyco/x-utils';
import { ComponentsDefinition } from './components';

type TailwindHelpers = Parameters<TailwindPluginFn>[0];

export interface PluginOptions {
  components?: (helpers: TailwindHelpers) => ComponentsDefinition;
  dynamicComponents?: (helpers: TailwindHelpers) => DeepPartial<ComponentsDefinition>;
  extra?: (helpers: TailwindHelpers) => Partial<TailwindHelpers>;
  theme?: Dictionary;
}
export default {
  components({ theme }: TailwindHelpers): ComponentsDefinition {
    return {
      '.btn': {
        backgroundColor: 'blue',
        color: theme('colors.neutral.50'),
        '&-lg': {
          color: theme('colors.neutral.75')
        }
      },
      '.icon': {
        color: '#000000'
      }
    };
  },
  dynamicComponents(_tailwindHelpers: TailwindHelpers) {
    return {
      btn: (value: any) => ({
        backgroundColor: value['75']
      })
    };
  },
  extra({ matchComponents, theme }: TailwindHelpers) {
    matchComponents(
      {
        btn: (value: any) => ({
          borderRadius: value
        })
      },
      { values: theme('borderRadius') }
    );
  },
  theme: {
    colors: {
      neutral: { 500: 'red', 100: 'orange' }
    }
  }
};
