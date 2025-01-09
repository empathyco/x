import { TailwindHelpers } from '../types';
import { dynamicLayout } from './dynamic-components/layout';

/**
 * Default dynamic component styles.
 *
 * @param helpers - A set of tailwind helpers to create the dynamic components.
 * @returns All the styles for each component and the values they are going to be generated with.
 *
 * @public
 */
export default function dynamicComponents(helpers: TailwindHelpers) {
  return {
    ...dynamicLayout(helpers)
  };
}
