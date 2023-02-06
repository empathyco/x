import { TailwindHelpers } from '../../../types';

/**
 * Returns the `container` element CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function container(helpers: TailwindHelpers) {
  return {
    container: {
      display: 'flex',
      flexFlow: 'column nowrap',
      height: '100%',
      maxHeight: '100%',
      justifyContent: 'flex-start',
      alignItems: 'stretch'
    }
  };
}
