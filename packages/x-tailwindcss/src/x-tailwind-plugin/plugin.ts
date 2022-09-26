import { deepMerge } from '@empathyco/x-deep-merge';
import { forEach } from '@empathyco/x-utils';
import plugin from 'tailwindcss/plugin';
import { Config } from 'tailwindcss';
import { PluginOptions, TailwindHelpers } from '../types';
import components from './components';
import dynamicComponents from './dynamic-components';
import dynamicUtilities from './dynamic-utilities';
import theme from './theme';
import utilities from './utilities';

export default plugin.withOptions(
  function (options?: PluginOptions) {
    return function (helpers: TailwindHelpers) {
      helpers.addComponents(deepMerge({}, components(helpers), options?.components?.(helpers)));
      forEach(
        deepMerge({}, dynamicComponents(helpers), options?.dynamicComponents?.(helpers)),
        (key, { styles, values }) => {
          helpers.matchComponents({ [key]: styles }, { values: values ?? undefined });
        }
      );

      forEach(
        deepMerge({}, dynamicUtilities(helpers), options?.dynamicUtilities?.(helpers)),
        (key, { styles, values }) => {
          helpers.matchUtilities({ [key]: styles }, { values: values ?? undefined });
        }
      );
      helpers.addUtilities(deepMerge({}, utilities(helpers), options?.utilities?.(helpers)));

      options?.extra?.(helpers);
    };
  },
  function (options) {
    return {
      theme: deepMerge({}, theme, options?.theme)
    } as Config;
  }
);
