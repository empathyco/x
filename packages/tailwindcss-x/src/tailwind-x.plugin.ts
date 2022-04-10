import plugin from 'tailwindcss/plugin';
import { deepMerge } from '@empathyco/x-deep-merge';
import dynamicComponents from './helpers/dynamic-components';
import dynamicUtilities from './helpers/dynamic-utilities';
import theme from './helpers/theme';
import components from './helpers/components';
import { PluginOptions } from './types';
import utilities from './helpers/utilities';

export default plugin.withOptions(
  function (options?: PluginOptions) {
    return function (tailwindHelpers) {
      const { addComponents, matchComponents, addUtilities, matchUtilities } = tailwindHelpers;
      const [componentValues, componentOptions] = dynamicComponents(tailwindHelpers);
      const [utilitiesValues, utilitiesOptions] = dynamicUtilities(tailwindHelpers);
      const [optionalComponents, optionalComponentsOptions] =
        options?.dynamicComponents?.(tailwindHelpers) ?? [];
      const [optionalUtilities, optionalUtilityOptions] =
        options?.dynamicUtilities?.(tailwindHelpers) ?? [];

      addComponents(
        deepMerge({}, components(tailwindHelpers), options?.components?.(tailwindHelpers))
      );
      matchComponents(
        deepMerge({}, componentValues, optionalComponents),
        deepMerge({}, componentOptions, optionalComponentsOptions)
      );
      addUtilities(
        deepMerge({}, utilities(tailwindHelpers), options?.utilities?.(tailwindHelpers))
      );
      matchUtilities(
        deepMerge({}, utilitiesValues, optionalUtilities),
        deepMerge({}, utilitiesOptions, optionalUtilityOptions)
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
