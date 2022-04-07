import { AnyFunction } from '@empathyco/x-utils';
import plugin, { TailwindPluginFn } from 'tailwindcss/plugin';
import { deepMerge } from '@empathyco/x-deep-merge';
import { PluginOptions } from './options';
import theme from './theme';
import components from './components';

export default plugin.withOptions(
  function (options?: PluginOptions) {
    return function (tailwindHelpers: Parameters<TailwindPluginFn>[0]) {
      const { addComponents, matchComponents, theme } = tailwindHelpers;
      addComponents(
        deepMerge({}, components(tailwindHelpers), options?.components?.(tailwindHelpers))
      );

      (matchComponents as AnyFunction)(
        {
          btn: (value: any) =>
            deepMerge(
              {},
              {
                backgroundColor: value['50'],
                color: value['25'] || (theme as AnyFunction)('white')
              },
              options?.dynamicComponents?.(tailwindHelpers)?.btn(value)
            )
        },
        { values: (theme as AnyFunction)('colors') }
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
