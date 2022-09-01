import { reduce } from '@empathyco/x-utils';
import plugin from 'tailwindcss/plugin';
import { CSSStyleOptions } from '../types';

export default plugin.withOptions(function (/*options?: PluginOptions*/) {
  return function ({ addBase, theme }) {
    const colorsMapping = {
      lead: theme('colors.primary.50'),
      auxiliary: theme('colors.secondary.25'),
      'neutral-10': theme('colors.neutral.90'),
      'neutral-35': theme('colors.neutral.75'),
      'neutral-70': theme('colors.neutral.25'),
      'neutral-95': theme('colors.neutral.10'),
      'neutral-100': theme('colors.neutral.0'),
      accent: theme('colors.secondary.50'),
      enable: theme('colors.success.50'),
      disable: theme('colors.error.50')
    };

    /*    const spacingMapping = {
      '01': theme('spacing.2') + 'px',
      '02': theme('spacing.4') + 'px',
      '03': theme('spacing.8') + 'px',
      '04': theme('spacing.12') + 'px',
      '05': theme('spacing.16') + 'px',
      '06': theme('spacing.24') + 'px',
      '07': theme('spacing.32') + 'px',
      '08': theme('spacing.40') + 'px',
      '09': theme('spacing.48') + 'px',
      '10': theme('spacing.56') + 'px',
      '11': theme('spacing.64') + 'px',
      '12': theme('spacing.80') + 'px',
      '13': theme('spacing.80') + 'px',
      '14': theme('spacing.96') + 'px',
      '15': theme('spacing.128') + 'px',
      '16': theme('spacing.152') + 'px',
      '17': theme('spacing.184') + 'px',
      '18': theme('spacing.216') + 'px',
      '19': theme('spacing.280') + 'px',
      '20': theme('spacing.344') + 'px'
    };*/

    const baseColors = reduce(
      colorsMapping,
      (baseColors, colorName, colorValue) => {
        baseColors[`--x-color-base-${colorName}`] = colorValue;
        return baseColors;
      },
      {} as CSSStyleOptions
    );

    addBase({
      ':root': {
        ...baseColors
      }
    });
  };
});
