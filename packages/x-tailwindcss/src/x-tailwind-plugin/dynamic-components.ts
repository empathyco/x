import { TailwindHelpers } from '../types';

/**
 * Default dynamic component styles.
 *
 * @param helpers - A set of tailwind helpers to create the dynamic components.
 * @returns All the styles for each component and the values they are going to be generated with.
 *
 * @public
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function dynamicComponents(helpers: TailwindHelpers) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { theme } = helpers;
  return {};
}

/**
 * The return type of {@link dynamicComponents}.
 *
 * @public
 */
export type ReturnOfDynamicComponents = ReturnType<typeof dynamicComponents>;
