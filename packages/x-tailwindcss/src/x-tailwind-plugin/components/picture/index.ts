import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../types';
import { pictureDefault } from './default';
import { overlay } from './overlay';
import { zoom } from './zoom';

/**
 * Returns the component `picture` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function picture(helpers: TailwindHelpers) {
  return {
    '.picture': {
      ...pictureDefault(helpers),
      ...rename(
        {
          ...zoom(),
          ...overlay(helpers)
        },
        {
          prefix: '&-'
        }
      )
    }
  };
}
