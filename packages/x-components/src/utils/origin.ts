import { QueryOrigin, QueryOriginInit, ResultOrigin } from '../types/origin';

/**
 * Creates a {@link QueryOrigin} or a {@link ResultOrigin} string given a {@link QueryFeature} and
 * a {@link FeatureLocation}.
 * If it can't be created, it returns `undefined`.
 *
 * @param originInit - An object containing the needed properties to create a {@link QueryOrigin} or
 * a {@link ResultOrigin}.
 * @returns The composed origin, or `undefined` if it is not able to create the origin.
 * @internal
 */
export function createOrigin({
  feature,
  location
}: QueryOriginInit): QueryOrigin | ResultOrigin | null {
  if (location && feature) {
    return `${feature}:${location}`;
  }
  return null;
}
