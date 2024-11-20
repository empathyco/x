import { deepMerge } from '@empathyco/x-deep-merge';
import { forEach } from '@empathyco/x-utils';
import plugin from 'tailwindcss/plugin';
import { PluginOptions, TailwindHelpers } from '../types';
import components from './components';
import dynamicComponents from './dynamic-components';
import dynamicUtilities from './dynamic-utilities';
import xTheme from './theme';
import utilities from './utilities';

/**
 * Defines the x-tailwind plugin as a Tailwind {@link plugin} that can be invoked passing a
 * configuration object to customize it. The plugin is bundled with generated static and dynamic
 * components and utilities, all based on the plugin's theme.
 *
 * @public
 */
export default plugin.withOptions(
  function (options?: PluginOptions) {
    /**
     * Registers the generated CSS for the components and utilities of the plugin to the
     * respective Tailwind layer. It depends on the plugin's theme, affecting
     * the color, spacing, etc... Of the styles generated in this step.
     *
     * @param helpers - The {@link TailwindHelpers}.
     * @internal
     */
    return function (helpers: TailwindHelpers) {
      helpers.addComponents(deepMerge({}, components(helpers), options?.components?.(helpers)), {
        respectPrefix: false
      });
      forEach(
        deepMerge({}, dynamicComponents(helpers), options?.dynamicComponents?.(helpers)),
        (key, { styles, values }) => {
          helpers.matchComponents({ [key]: styles }, { values: values ?? undefined });
        }
      );

      forEach(
        deepMerge({}, dynamicUtilities(helpers), options?.dynamicUtilities?.(helpers)),
        (key, { styles, values }) => {
          helpers.matchUtilities(
            { [key]: styles },
            { respectPrefix: false, values: values ?? undefined }
          );
        }
      );
      helpers.addUtilities(deepMerge({}, utilities(helpers), options?.utilities?.(helpers)), {
        respectPrefix: false
      });

      options?.extra?.(helpers);
      helpers.addVariant('selected', '&.selected');
    };
  },
  function (options = {}) {
    return {
      theme: {
        x: deepMerge(
          { colors: { current: 'currentColor', transparent: 'transparent' } },
          xTheme,
          options?.theme
        )
      }
    };
  }
);
