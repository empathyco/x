import { Dictionary, reduce } from '@empathyco/x-utils';
import plugin from 'tailwindcss/plugin';
import { TailwindHelpers } from '../types';

/**
 * Maps a `Dictionary` to another with the same properties but adding a prefix the keys.
 *
 * @param prefix - The prefix to add.
 * @param obj - The `Dictionary` to map.
 * @returns A new `Dictionary` with the keys prefixed.
 */
function mapPrefix<SomeObject extends Dictionary, Prefix extends string>(
  prefix: Prefix,
  obj: SomeObject
): PrefixObject<SomeObject, Prefix> {
  return reduce(
    obj,
    (result, key, value) => {
      result[`${prefix}${key as string}`] = value;
      return result;
    },
    {} as PrefixObject<SomeObject, Prefix>
  );
}

/**
 * Prefix the given object type keys.
 */
type PrefixObject<SomeObject extends Dictionary, Prefix extends string> = {
  [Key in keyof SomeObject as `${Prefix}${Key & string}`]: SomeObject[Key];
};

/**
 * Integrates tailwind theme with the old design system tokens.
 */
export default plugin(function ({ addBase, theme }: TailwindHelpers) {
  addBase({
    ':root': {
      // COLOR
      ...mapPrefix('--x-color-base-', {
        lead: theme('colors.lead.50'),
        auxiliary: theme('colors.auxiliary.25'),
        'neutral-10': theme('colors.neutral.90'),
        'neutral-35': theme('colors.neutral.75'),
        'neutral-70': theme('colors.neutral.25'),
        'neutral-95': theme('colors.neutral.10'),
        'neutral-100': theme('colors.neutral.0'),
        accent: theme('colors.auxiliary.50'),
        enable: theme('colors.success.50'),
        disable: theme('colors.error.50')
      }),

      // SPACING
      ...mapPrefix('--x-size-base-', {
        '01': theme('spacing.2'),
        '02': theme('spacing.4'),
        '03': theme('spacing.8'),
        '04': theme('spacing.12'),
        '05': theme('spacing.16'),
        '06': theme('spacing.24'),
        '07': theme('spacing.32'),
        '08': theme('spacing.40'),
        '09': theme('spacing.48'),
        '10': theme('spacing.56'),
        '11': theme('spacing.64'),
        '12': theme('spacing.80'),
        '13': theme('spacing.80'),
        '14': theme('spacing.96'),
        '15': theme('spacing.128'),
        '16': theme('spacing.152'),
        '17': theme('spacing.184'),
        '18': theme('spacing.216'),
        '19': theme('spacing.280'),
        '20': theme('spacing.344')
      }),

      // BORDER
      ...mapPrefix('--x-size-border-', {
        'radius-base-pill': theme('borderRadius.round'),
        'width-base': theme('borderWidth.1')
      }),

      // FONT FAMILY
      '--x-font-family-base': theme('fontFamily.primary'),

      // FONT SIZES
      ...mapPrefix('--x-size-font-', {
        'base-xs': theme('fontSize.xs'),
        'base-s': theme('fontSize.sm'),
        'base-m': theme('fontSize.md'),
        'base-l': theme('fontSize.lg'),
        'base-xl': theme('fontSize.2xl')
      }),

      // FONT WEIGHT
      ...mapPrefix('--x-number-font-weight-base-', {
        light: theme('fontWeight.light'),
        regular: theme('fontWeight.regular'),
        bold: theme('fontWeight.bold')
      }),

      // LINE HEIGHT
      ...mapPrefix('--x-size-line-height-base-', {
        s: theme('lineHeight.sm'),
        m: theme('lineHeight.md'),
        l: theme('lineHeight.lg')
      })
    }
  });
});
