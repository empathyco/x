import type { TailwindHelpers } from '../../../types'
import { highlightDefault } from './default'

/**
 * Returns the `highlight` component CSS. The highlight component serves to emphasize certain part
 * of a text.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function highlight(helpers: TailwindHelpers) {
  return {
    '.highlight-text': {
      ...highlightDefault(helpers),
    },
  }
}
