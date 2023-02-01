import { TailwindHelpers } from '../../../types';

/**
 * Returns the `default` element CSS.
 *
 * @param helpers
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-unused-vars
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
