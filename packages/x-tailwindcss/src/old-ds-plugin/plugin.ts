import type { Dictionary } from '@empathyco/x-utils'
import type { TailwindHelpers } from '../types'
import { reduce } from '@empathyco/x-utils'

/**
 * Maps a `Dictionary` to another with the same properties but adding a prefix the keys.
 *
 * @param prefix - The prefix to add.
 * @param obj - The `Dictionary` to map.
 * @returns A new `Dictionary` with the keys prefixed.
 */
function mapPrefix<SomeObject extends Dictionary, Prefix extends string>(
    prefix: Prefix,
    obj: SomeObject,
): PrefixObject<SomeObject, Prefix> {
    return reduce(
        obj,
        (result, key, value) => {
            result[`${prefix}${key as string}`] = value
            return result
        },
        {} as PrefixObject<SomeObject, Prefix>,
    )
}

/**
 * Prefix the given object type keys.
 */
type PrefixObject<SomeObject extends Dictionary, Prefix extends string> = {
    [Key in keyof SomeObject as `${Prefix}${Key & string}`]: SomeObject[Key]
}

/**
 * Integrates tailwind theme with the old design system tokens.
 */

export default {
    handler: (helpers: TailwindHelpers) => {
        const addBase = helpers.addBase as (rules: Record<string, any>) => void
        const theme = helpers.theme
        addBase({
            ':root': {
                // COLOR
                ...mapPrefix('--x-color-base-', {
                    lead: theme('x.colors.lead.50'),
                    auxiliary: theme('x.colors.auxiliary.25'),
                    'neutral-10': theme('x.colors.neutral.90'),
                    'neutral-35': theme('x.colors.neutral.75'),
                    'neutral-70': theme('x.colors.neutral.25'),
                    'neutral-95': theme('x.colors.neutral.10'),
                    'neutral-100': theme('x.colors.neutral.0'),
                    accent: theme('x.colors.auxiliary.50'),
                    enable: theme('x.colors.success.50'),
                    disable: theme('x.colors.error.50'),
                }),

                // SPACING
                ...mapPrefix('--x-size-base-', {
                    '01': theme('x.spacing.2'),
                    '02': theme('x.spacing.4'),
                    '03': theme('x.spacing.8'),
                    '04': theme('x.spacing.12'),
                    '05': theme('x.spacing.16'),
                    '06': theme('x.spacing.24'),
                    '07': theme('x.spacing.32'),
                    '08': theme('x.spacing.40'),
                    '09': theme('x.spacing.48'),
                    '10': theme('x.spacing.56'),
                    '11': theme('x.spacing.64'),
                    '12': theme('x.spacing.80'),
                    '13': theme('x.spacing.80'),
                    '14': theme('x.spacing.96'),
                    '15': theme('x.spacing.128'),
                    '16': '152px',
                    '17': '184px',
                    '18': '216px',
                    '19': '280px',
                    '20': '344px',
                }),

                // BORDER
                ...mapPrefix('--x-size-border-', {
                    'radius-base-pill': theme('x.borderRadius.round'),
                    'width-base': theme('x.borderWidth.1'),
                }),

                // FONT FAMILY
                '--x-font-family-base': theme('x.fontFamily.main'),

                // FONT SIZES
                ...mapPrefix('--x-size-font-', {
                    'base-xs': theme('x.fontSize.xs'),
                    'base-s': theme('x.fontSize.sm'),
                    'base-m': theme('x.fontSize.md'),
                    'base-l': theme('x.fontSize.lg'),
                    'base-xl': theme('x.fontSize.2xl'),
                }),

                // FONT WEIGHT
                ...mapPrefix('--x-number-font-weight-base-', {
                    light: theme('x.fontWeight.light'),
                    regular: theme('x.fontWeight.regular'),
                    bold: theme('x.fontWeight.bold'),
                }),

                // LINE HEIGHT
                ...mapPrefix('--x-size-line-height-base-', {
                    s: theme('x.lineHeight.sm'),
                    m: theme('x.lineHeight.md'),
                    l: theme('x.lineHeight.lg'),
                }),

                // TEXT
                '--x-color-text-default': theme('x.colors.neutral.100'),
                '--x-font-family-text': theme('x.fontFamily.main'),
                '--x-size-font-text': theme('x.fontSize.sm'),
                '--x-number-font-weight-text': theme('x.fontWeight.regular'),
                '--x-size-line-height-text': theme('x.lineHeight.sm'),

                // TITLE 3
                '--x-font-family-title3': theme('x.fontFamily.main'),
                '--x-size-font-title3': theme('x.fontSize.md'),
                '--x-number-font-weight-title3': theme('x.fontWeight.regular'),
                '--x-size-line-height-title3': theme('x.lineHeight.md'),

                // IMAGE
                '--x-number-aspect-ratio-picture': theme('x.aspectRatio.default'),
            },
        })
    },
}
