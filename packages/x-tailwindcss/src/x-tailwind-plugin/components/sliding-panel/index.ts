import type { TailwindHelpers } from '../../../types'
import { deepMerge } from '@empathyco/x-deep-merge'
import { slidingPanelDefault } from './default'
import { slidingPanelFade } from './fade'

/**
 * Returns the component `sliding panel` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function slidingPanel(helpers: TailwindHelpers) {
  return {
    '.sliding-panel': {
      ...deepMerge(slidingPanelDefault(), slidingPanelFade(helpers)),
    },
  }
}
