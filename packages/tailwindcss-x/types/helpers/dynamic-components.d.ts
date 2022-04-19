import { DynamicStylesOptions, TailwindHelpers } from '../types';
/**
 * Default dynamic component styles.
 *
 * @returns All the styles for each component and the values they are going to be generated with.
 */
export default function dynamicComponents({
  theme
}: Partial<TailwindHelpers>): DynamicStylesOptions;
