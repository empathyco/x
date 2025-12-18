import type { CSSRuleObject, TailwindHelpers } from '../types'

/**
 * Default utility styles.
 *
 * @param helpers - A set of tailwind helpers to create the utilities.
 * @returns All the styles for each utility.
 *
 * @public
 */
export default function utilities({ theme }: TailwindHelpers) {
  return {
    // TODO: replace this example styles with actual design styles
    '.x-border-large': {
      borderStyle: 'solid',
      borderWidth: theme('x.borderWidth.4'),
      borderColor: theme('x.colors.neutral.100'),
    },
    // This is here to not include it in the bundle if it is not being used
    '.x-disable-icon-offset *': {
      '--enableIconOffset': 'var(--OFF)',
    },
  } as unknown as CSSRuleObject
}
