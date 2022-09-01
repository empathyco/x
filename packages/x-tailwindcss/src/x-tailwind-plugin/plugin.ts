import { deepMerge } from '@empathyco/x-deep-merge';
import { forEach } from '@empathyco/x-utils';
import plugin from 'tailwindcss/plugin';
import components from './components';
import dynamicComponents from './dynamic-components';
import dynamicUtilities from './dynamic-utilities';
import theme from './theme';
import utilities from './utilities';
import { PluginOptions } from '../types';

export default plugin.withOptions(
  function (options?: PluginOptions) {
    return function (tailwindHelpers) {
      const { addComponents, matchComponents, addUtilities, matchUtilities, theme } =
        tailwindHelpers;

      forEach(
        deepMerge({}, dynamicComponents({ theme }), options?.dynamicComponents?.({ theme })),
        (key, { styles, values }) => {
          matchComponents({ [key]: styles }, { values: values ?? undefined });
        }
      );
      addComponents(deepMerge({}, components({ theme }), options?.components?.({ theme })));

      forEach(
        deepMerge({}, dynamicUtilities({ theme }), options?.dynamicUtilities?.({ theme })),
        (key, { styles, values }) => {
          matchUtilities({ [key]: styles }, { values: values ?? undefined });
        }
      );
      addUtilities(deepMerge({}, utilities({ theme }), options?.utilities?.({ theme })));

      options?.extra?.({ theme });
    };
  },
  function (options) {
    return {
      theme: deepMerge({}, theme, options?.theme)
    };
  }
);
