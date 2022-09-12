import { deepMerge } from '@empathyco/x-deep-merge';
import { forEach } from '@empathyco/x-utils';
import plugin from 'tailwindcss/plugin';
import { PluginOptions, TailwindHelpers } from '../types';
import components from './components';
import dynamicComponents from './dynamic-components';
import dynamicUtilities from './dynamic-utilities';
import theme from './theme';
import utilities from './utilities';

export default plugin.withOptions(
  function (options?: PluginOptions) {
    return function (tailwindHelpers: TailwindHelpers) {
      const { addComponents, matchComponents, addUtilities, matchUtilities } = tailwindHelpers;

      forEach(
        deepMerge(
          {},
          dynamicComponents(tailwindHelpers),
          options?.dynamicComponents?.(tailwindHelpers)
        ),
        (key, { styles, values }) => {
          matchComponents({ [key]: styles }, { values: values ?? undefined });
        }
      );
      addComponents(
        deepMerge({}, components(tailwindHelpers), options?.components?.(tailwindHelpers))
      );

      forEach(
        deepMerge(
          {},
          dynamicUtilities(tailwindHelpers),
          options?.dynamicUtilities?.(tailwindHelpers)
        ),
        (key, { styles, values }) => {
          matchUtilities({ [key]: styles }, { values: values ?? undefined });
        }
      );
      addUtilities(
        deepMerge({}, utilities(tailwindHelpers), options?.utilities?.(tailwindHelpers))
      );

      options?.extra?.(tailwindHelpers);
    };
  },
  function (options) {
    return {
      theme: deepMerge({}, theme, options?.theme)
    };
  }
);
