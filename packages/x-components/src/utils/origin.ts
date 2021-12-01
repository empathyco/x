import { QueryOrigin, QueryOriginInit, ResultOrigin } from '../types/origin';

/**
 * Creates a {@link QueryOrigin} or a {@link ResultOrigin} string given a {@link QueryFeature} and
 * a {@link FeatureLocation}.
 * If it can't be created, it returns `null`.
 *
 * @param originInit - An object containing the needed properties to create a {@link QueryOrigin} or
 * a {@link ResultOrigin}.
 *
 * @returns The composed origin, or `null` if it is not able to create the origin.
 *
 * @internal
 */
export function createOrigin({
  feature,
  location
}: QueryOriginInit): QueryOrigin | ResultOrigin | null {
  if (feature) {
    return `${feature}:${location ?? 'none'}`;
  }
  return null;
}
