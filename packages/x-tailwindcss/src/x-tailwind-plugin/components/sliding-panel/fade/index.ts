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
    '.x-sliding-panel-fade': {
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
    '&.x-sliding-panel-at-start': {
      '.x-sliding-panel-fade': {
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
    '&.x-sliding-panel-at-end': {
      '.x-sliding-panel-fade': {
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
    },
    '&.x-sliding-panel-at-start.x-sliding-panel-at-end': {
      '.x-sliding-panel-fade': {
        mask: 'none'
      }
    }
  };
}
