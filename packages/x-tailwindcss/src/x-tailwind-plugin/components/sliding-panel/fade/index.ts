import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../../types';
import { fadeDefaultSizes, fadeEndSizes, fadeStartSizes } from './sizes';

/**
 * Returns the styles for the component `sliding panel fade`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function slidingPanelFade(helpers: TailwindHelpers) {
  const defaultSizes = fadeDefaultSizes(helpers);
  const startSizes = fadeStartSizes(helpers);
  const endSizes = fadeEndSizes(helpers);
  return {
    '.sliding-panel-fade': {
      ...defaultSizes.md,
      ...rename(
        {
          ...defaultSizes
        },
        {
          prefix: '&-'
        }
      )
    },
    '.sliding-panel-at-start': {
      '.sliding-panel-fade': {
        ...startSizes.md,
        ...rename(
          {
            ...startSizes
          },
          {
            prefix: '&-'
          }
        )
      }
    },
    '.sliding-panel-at-end': {
      '.sliding-panel-fade': {
        ...endSizes.md,
        ...rename(
          {
            ...endSizes
          },
          {
            prefix: '&-'
          }
        )
      }
    }
  };
}
